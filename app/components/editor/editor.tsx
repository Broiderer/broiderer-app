'use client'

import { MouseEvent, WheelEvent, useEffect, useRef, useState } from 'react'
import * as paper from 'paper'
import styles from './editro.module.scss'
import { Point } from 'paper/dist/paper-core'

paper.install(document)
const ZOOM_FACTOR = 1.02

export default function Editor() {
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const paperRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (paperRef.current) {
      paper.setup(paperRef.current)
      paper.view.autoUpdate = true
      console.log('install')

      initFakeScene()
    }
  }, [paperRef])

  function initFakeScene() {
    var path = new paper.Path()

    new paper.Path.Circle({
      center: paper.view.center,
      radius: 100,
      fillColor: 'red',
    })
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

  function wheelHandler(e: WheelEvent<HTMLCanvasElement>) {
    // Store previous view state.
    const oldZoom = paper.view.zoom
    const oldCenter = paper.view.center

    // Get mouse position.
    // It needs to be converted into project coordinates system.
    const mousePosition = paper.view.viewToProject(
      new Point(e.clientX, e.clientY)
    )

    // Update view zoom.
    var newZoom = e.deltaY < 0 ? oldZoom * ZOOM_FACTOR : oldZoom / ZOOM_FACTOR
    paper.view.zoom = newZoom

    // Update view position.
    paper.view.center = new Point(
      oldCenter.x + (mousePosition.x - oldCenter.x) * (1 - oldZoom / newZoom),
      oldCenter.y + (mousePosition.y - oldCenter.y) * (1 - oldZoom / newZoom)
    )

    paper.view.requestUpdate()
  }

  function mouseDownHandler(e: MouseEvent<HTMLCanvasElement>) {
    setIsDragging(true)
  }

  function mouseUpHandler(e: MouseEvent<HTMLCanvasElement>) {
    setIsDragging(false)
  }

  function mouseOutHandler(e: MouseEvent<HTMLCanvasElement>) {
    setIsDragging(false)
  }

  function mouseMoveHandler(e: MouseEvent<HTMLCanvasElement>) {
    if (isDragging) {
      paper.view.center = new Point(
        paper.view.center.x - e.movementX / paper.view.zoom,
        paper.view.center.y - e.movementY / paper.view.zoom
      )
    }
  }

  return (
    <canvas
      className={`${styles['paper-canvas']} ${
        isDragging ? styles['dragging'] : ''
      }`}
      ref={paperRef}
      onWheel={wheelHandler}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseOut={mouseOutHandler}
      onMouseMove={mouseMoveHandler}
    ></canvas>
  )
}
