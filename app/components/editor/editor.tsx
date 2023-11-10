'use client'

import { useEffect, useRef } from 'react'
import * as paper from 'paper'
import styles from './editro.module.scss'

paper.install(document)

export default function Editor() {
  const paperRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (paperRef.current) {
      paper.setup(paperRef.current)
      paper.view.autoUpdate = true
      console.log('install')

      var path = new paper.Path()
      // Give the stroke a color
      path.strokeColor = 'black' as any
      var start = new paper.Point(100, 100)
      // Move to start and draw a line from there
      path.moveTo(start)
      // Note that the plus operator on Point objects does not work
      // in JavaScript. Instead, we need to call the add() function:
      path.lineTo(start.add([1000, 1050]))
      // Draw the view now:
      paper.view.requestUpdate()
    }
  }, [paperRef.current])

  return <canvas className={styles['paper-canvas']} ref={paperRef}></canvas>
}
