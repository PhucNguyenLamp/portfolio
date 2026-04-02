import { useEffect, useState } from 'react'
import './App.css'
import projects from './constants/projects'
import Card from './components/Card'
import Space from './components/Space'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import { Toaster } from 'react-hot-toast'

function App() {
  const [isNightMode, setIsNightMode] = useState(false)
  const baseUrl = import.meta.env.BASE_URL

  useEffect(() => {
    document.documentElement.dataset.theme = isNightMode ? 'night' : 'day'

    return () => {
      delete document.documentElement.dataset.theme
    }
  }, [isNightMode])

  return (
    <>
      <Space opacity={isNightMode ? 1 : 0.5} />
      <div className="page-shell">
        <button
          type="button"
          className={`theme-toggle ${isNightMode ? 'theme-toggle--night' : 'theme-toggle--day'}`}
          onClick={() => setIsNightMode((current) => !current)}
          aria-pressed={isNightMode}
          aria-label={isNightMode ? 'Switch to day mode' : 'Switch to night mode'}
        >
          {isNightMode ? (
            <>
              <MoonIcon className="theme-toggle__icon" aria-hidden="true" />
            </>
          ) : (
            <>
              <SunIcon className="theme-toggle__icon" aria-hidden="true" />
            </>
          )}
        </button>

        <section id="center">
          <div className="hero text-4xl font-bold">
            phuc nguyen
          </div>
          <div className="hero">
            software dev
          </div>
        </section>

        <div className="ticks"></div>

        <section id="next-steps">
          <div id="docs">
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href={`${baseUrl}icons.svg#documentation-icon`}></use>
            </svg>
            <h2>projects</h2>
            <p>stuffs i have worked on</p>
            <ul className='flex flex-col'>
              {projects.map((project, index) => (
                <Card key={index} {...project} />
              ))}
            </ul>
            <div> You've reached the end!</div>
            <div> i've got more projects on my <a href="https://github.com/PhucNguyenLamp" target="_blank" className='underline'>github</a>, but i thought they would be irrelevant to show you here</div>
          </div>
          <div id="social">
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href={`${baseUrl}icons.svg#social-icon`}></use>
            </svg>
            <h2>connect</h2>
            <p>my social profiles</p>
            <a href="mailto:phuc.nguyengia@hcmut.edu.vn" className='underline'>phuc.nguyengia@hcmut.edu.vn</a><br></br>
            <a href="mailto:giaphuc29082004@gmail.com" className='underline'>giaphuc29082004@gmail.com</a>
            <ul>
              <li>
                <a href="https://github.com/PhucNguyenLamp" target="_blank">
                  <svg
                    className="button-icon"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <use href={`${baseUrl}icons.svg#github-icon`}></use>
                  </svg>
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://discord.com/users/345935986217320449" target="_blank">
                  <svg
                    className="button-icon"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <use href={`${baseUrl}icons.svg#discord-icon`}></use>
                  </svg>
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </section>

        <div className="ticks"></div>
        <section id="spacer"></section>
      </div>
      <Toaster position="bottom-right" />
    </>
  )
}

export default App
