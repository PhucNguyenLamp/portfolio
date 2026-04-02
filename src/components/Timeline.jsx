import React from 'react'

export default function Timeline({components}) {
    // componets =  [<Card />, <Card />, <Card />]
  return (
    <div>
      {
        components.map((component, index) => (
          <div key={index}>
            {component}
          </div>
        ))
      }
    </div>
  )
}
