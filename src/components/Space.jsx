import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
    EffectComposer,
    FXAAShader,
    Lensflare,
    LensflareElement,
    OBJLoader,
    OrbitControls,
    OutputPass,
    RenderPass,
    ShaderPass,
    UnrealBloomPass,
    MTLLoader,
} from 'three/examples/jsm/Addons.js'

export default function Space({ opacity = 0.2 }) {
    const mountRef = useRef(null)
    const bananaMtlUrl = new URL('../assets/models/banana/source/export_banana.mtl', import.meta.url).href
    const bananaObjUrl = new URL('../assets/models/banana/source/export_banana.obj', import.meta.url).href
    const bananaTextureUrl = new URL('../assets/models/banana/textures/Diffuse.png', import.meta.url).href
    const lensflareTextureUrl = new URL('../assets/models/lensflare/textures/lensflare3.png', import.meta.url).href

    useEffect(() => {
        const mount = mountRef.current
        if (!mount) return undefined

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set(0, 7, 10)

        const renderer = new THREE.WebGLRenderer({ precision: 'highp', alpha: true, antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setClearColor(0x000000, 0)
        mount.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.autoRotate = true
        controls.autoRotateSpeed = 1
        controls.enableDamping = true
        controls.enableRotate = true
        controls.enablePan = false
        controls.enableZoom = false

        const composer = new EffectComposer(renderer)
        composer.addPass(new RenderPass(scene, camera))

        const fxaaPass = new ShaderPass(FXAAShader)
        const pixelRatio = renderer.getPixelRatio()
        fxaaPass.material.uniforms.resolution.value.set(
            1 / (window.innerWidth * pixelRatio * 1.25),
            1 / (window.innerHeight * pixelRatio * 1.25),
        )
        composer.addPass(fxaaPass)

        composer.addPass(
            new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.1, 0),
        )
        composer.addPass(new OutputPass())

        const textureLoader = new THREE.TextureLoader()
        const objLoader = new OBJLoader()
        const mtlLoader = new MTLLoader()
        let banana = null
        let frameId = 0

        mtlLoader.load(bananaMtlUrl, (materials) => {
            materials.preload()
            objLoader.setMaterials(materials)
            objLoader.load(bananaObjUrl, (object) => {
                const texture = textureLoader.load(bananaTextureUrl)
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material.map = texture
                        child.material.needsUpdate = true
                        child.layers.set(0)
                    }
                })
                banana = object
                scene.add(object)
            })
        })

        const starGeometry = new THREE.SphereGeometry(0.5, 24, 24)
        const starMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xffd700,
            emissiveIntensity: 2,
            depthWrite: false,
        })
        const star = new THREE.Mesh(starGeometry, starMaterial)
        scene.add(star)

        const sunlight = new THREE.PointLight(0xffd700, 15, 0)
        sunlight.position.set(0, 0, 0)
        sunlight.layers.set(0)

        scene.add(new THREE.AmbientLight(0xffffff, 0.05))

        const textureFlare = textureLoader.load(lensflareTextureUrl)
        const lensflare = new Lensflare()
        lensflare.addElement(new LensflareElement(textureFlare, 30, 0.7, sunlight.color))
        lensflare.addElement(new LensflareElement(textureFlare, 40, 0.9, sunlight.color))
        lensflare.addElement(new LensflareElement(textureFlare, 25, 1, sunlight.color))
        sunlight.add(lensflare)
        scene.add(sunlight)

        const createStarField = () => {
            const starCount = 1000
            const starFieldGeometry = new THREE.BufferGeometry()
            const starPositions = new Float32Array(starCount * 3)

            for (let i = 0; i < starCount; i++) {
                starPositions[i * 3] = (Math.random() - 0.5) * 100
                starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100
                starPositions[i * 3 + 2] = (Math.random() - 0.5) * 100
            }

            starFieldGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))

            const starField = new THREE.Points(
                starFieldGeometry,
                new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 }),
            )
            scene.add(starField)

            const linePositions = new Float32Array(starCount * 6)
            const colors = ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#FFFFFF', '#0000FF']
            const lineColors = new Float32Array(starCount * 6)

            for (let i = 0; i < starCount; i++) {
                const x = starPositions[i * 3]
                const y = starPositions[i * 3 + 1]
                const z = starPositions[i * 3 + 2]

                linePositions[i * 6] = x
                linePositions[i * 6 + 1] = y
                linePositions[i * 6 + 2] = z
                linePositions[i * 6 + 3] = x + 1
                linePositions[i * 6 + 4] = y - 0.5
                linePositions[i * 6 + 5] = z + 1

                const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)])
                lineColors.set([color.r, color.g, color.b, color.r, color.g, color.b], i * 6)
            }

            const lineGeometry = new THREE.BufferGeometry()
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
            lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))

            const lineSegments = new THREE.LineSegments(
                lineGeometry,
                new THREE.LineBasicMaterial({ vertexColors: true }),
            )
            scene.add(lineSegments)

            return { starField, lineSegments }
        }

        const { starField, lineSegments } = createStarField()

        let orbitAngle = 0
        const radius = 3

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            composer.setSize(window.innerWidth, window.innerHeight)
            fxaaPass.material.uniforms.resolution.value.set(
                1 / (window.innerWidth * pixelRatio * 1.25),
                1 / (window.innerHeight * pixelRatio * 1.25),
            )
        }

        window.addEventListener('resize', handleResize)

        const animate = () => {
            controls.update()
            composer.render()

            if (banana) {
                orbitAngle += 0.01
                banana.position.x = star.position.x + radius * Math.cos(orbitAngle)
                banana.position.y = star.position.y + radius * Math.sin(orbitAngle)
                banana.rotation.x += 0.01
                banana.rotation.y += 0.014
            }

            const starPositions = starField.geometry.attributes.position
            const linePositionAttribute = lineSegments.geometry.attributes.position

            for (let i = 0; i < starPositions.count; i++) {
                const x = starPositions.getX(i)
                const y = starPositions.getY(i)
                const z = starPositions.getZ(i)

                starPositions.setX(i, x < -50 ? 50 : x - 0.1)
                starPositions.setY(i, y > 50 ? -50 : y + 0.05)
                starPositions.setZ(i, z < -50 ? 50 : z - 0.1)

                linePositionAttribute.setXYZ(i * 2, x, y, z)
                linePositionAttribute.setXYZ(i * 2 + 1, x + 5, y - 2.5, z + 5)
            }

            starPositions.needsUpdate = true
            linePositionAttribute.needsUpdate = true
        }

        if (renderer.setAnimationLoop) {
            renderer.setAnimationLoop(animate)
        } else {
            frameId = requestAnimationFrame(animate)
        }

        return () => {
            window.removeEventListener('resize', handleResize)
            if (renderer.setAnimationLoop) {
                renderer.setAnimationLoop(null)
            } else {
                cancelAnimationFrame(frameId)
            }
            controls.dispose()
            composer.dispose()
            renderer.dispose()
            mount.removeChild(renderer.domElement)
        }
    }, [])

    return <div ref={mountRef} className="space-background" style={{ opacity }} aria-hidden="true" />
}
