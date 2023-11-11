'use client'

import { MouseEvent, WheelEvent, useEffect, useRef, useState } from 'react'
import * as paper from 'paper'
import styles from './editro.module.scss'
import { Point } from 'paper/dist/paper-core'

paper.install(document)
const ZOOM_FACTOR = 1.02
const ZOOM_BOUNDS = { min: 0.5, max: 5 }
const GRID_GAP = 50

export default function Editor() {
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const paperRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (paperRef.current) {
      paper.setup(paperRef.current)
      paper.view.autoUpdate = true

      initFakeScene()
      updateAxes(paper.view)
      updateGrid(paper.view)
    }
  }, [paperRef])

  function initFakeScene() {
    const gridLayer = new paper.Layer()
    gridLayer.name = 'broiderer-grid'

    const axesLayer = new paper.Layer()
    axesLayer.name = 'broiderer-axes'

    const fakeLayer = new paper.Layer()
    fakeLayer.name = 'broiderer-fake-test'

    var path = new paper.Path()

    const circle = new paper.Path.Circle({
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

    fakeLayer.addChild(path)
    fakeLayer.addChild(circle)

    // Draw the view now:
    paper.view.requestUpdate()
  }

  function updateAxes(view: paper.View) {
    const axesLayer = paper.project.layers.find(
      (layer) => layer.name === 'broiderer-axes'
    )

    const axesAlreadyDrawn = axesLayer?.hasChildren()

    if (axesAlreadyDrawn) {
      // If axes are already drawn, update their positions
      const axisX = axesLayer?.children.find(
        (child) => child.name === 'broiderer-axis-x'
      ) as paper.Path
      const axisY = axesLayer?.children.find(
        (child) => child.name === 'broiderer-axis-y'
      ) as paper.Path

      axisX.segments[0].point.x = view.bounds.left
      axisX.segments[1].point.x = view.bounds.right

      axisY.segments[0].point.y = view.bounds.top
      axisY.segments[1].point.y = view.bounds.bottom
    } else {
      // If axes are not drawn, create and add them to the gridLayer
      const axisX = new paper.Path()
      axisX.name = 'broiderer-axis-x'
      axisX.moveTo(new paper.Point(view.bounds.left, 0))
      axisX.lineTo(new paper.Point(view.bounds.right, 0))
      axisX.strokeColor = new paper.Color('blue')
      axisX.style.strokeWidth = 2
      axesLayer?.addChild(axisX)

      const axisY = new paper.Path()
      axisY.name = 'broiderer-axis-y'
      axisY.moveTo(new paper.Point(0, view.bounds.top))
      axisY.lineTo(new paper.Point(0, view.bounds.bottom))
      axisY.strokeColor = new paper.Color('blue')
      axisY.style.strokeWidth = 2
      axesLayer?.addChild(axisY)
    }
  }

  function updateGrid(view: paper.View) {
    const gridLayer = paper.project.layers.find(
      (layer) => layer.name === 'broiderer-grid'
    )

    const leftBound =
      view.bounds.left - (view.bounds.left % GRID_GAP) - GRID_GAP
    const rightBound =
      view.bounds.right - (view.bounds.right % GRID_GAP) + GRID_GAP
    const topBound = view.bounds.top - (view.bounds.top % GRID_GAP) - GRID_GAP
    const bottomBound =
      view.bounds.bottom - (view.bounds.bottom % GRID_GAP) + GRID_GAP

    // Check if the grid is already drawn
    const gridAlreadyDrawn = gridLayer?.hasChildren()
    if (gridAlreadyDrawn) {
      const childrenY =
        gridLayer?.children.filter(
          (child) => child.name === 'broiderer-grid-line-y'
        ) || []
      const childrenX =
        gridLayer?.children.filter(
          (child) => child.name === 'broiderer-grid-line-x'
        ) || []
      let indexX = 0
      let indexY = 0
      for (let x = leftBound; x <= rightBound; x += GRID_GAP) {
        //  Update each vertical grid line position
        const child = childrenY[indexX] as paper.Path
        if (!child) {
          //  If there's not enough lines yes, create a new one
          const newPath = createGridLinePath(
            new paper.Point(x, topBound),
            new paper.Point(x, bottomBound),
            'y'
          )
          gridLayer?.addChild(newPath)
          continue
        }
        child.segments[0].point.x = x
        child.segments[0].point.y = topBound
        child.segments[1].point.x = x
        child.segments[1].point.y = bottomBound
        indexX++
      }
      //  If there's too many grid lines, delete the surplus
      if (childrenY.length > indexX) {
        for (const child of childrenY.slice(indexX)) {
          child.remove()
        }
      }

      for (let y = topBound; y <= bottomBound; y += GRID_GAP) {
        const child = childrenX[indexY] as paper.Path
        if (!child) {
          const newPath = createGridLinePath(
            new paper.Point(leftBound, y),
            new paper.Point(rightBound, y),
            'x'
          )
          gridLayer?.addChild(newPath)
          continue
        }
        child.segments[0].point.x = leftBound
        child.segments[0].point.y = y
        child.segments[1].point.x = rightBound
        child.segments[1].point.y = y
        indexY++
      }
      if (childrenX.length > indexY) {
        for (const child of childrenX.slice(indexY)) {
          child.remove()
        }
      }
    } else {
      // Draw horizontal grid lines
      for (let x = leftBound; x <= rightBound; x += GRID_GAP) {
        const newPath = createGridLinePath(
          new paper.Point(x, topBound),
          new paper.Point(x, bottomBound),
          'y'
        )
        gridLayer?.addChild(newPath)
      }

      // Draw vertical grid lines
      for (let y = topBound; y <= bottomBound; y += GRID_GAP) {
        const newPath = createGridLinePath(
          new paper.Point(leftBound, y),
          new paper.Point(rightBound, y),
          'x'
        )
        gridLayer?.addChild(newPath)
      }
    }
  }

  function createGridLinePath(
    from: paper.Point,
    to: paper.Point,
    type: 'x' | 'y'
  ): paper.Path {
    const path = new paper.Path()
    path.name = `broiderer-grid-line-${type}`
    path.strokeColor = new paper.Color('lightgray')
    path.moveTo(from)
    path.lineTo(to)
    return path
  }

  function wheelHandler(e: WheelEvent<HTMLCanvasElement>) {
    // Store previous view state
    const oldZoom = paper.view.zoom
    const oldCenter = paper.view.center

    // Get mouse position
    // It needs to be converted into project coordinates system
    const mousePosition = paper.view.viewToProject(
      new Point(e.clientX, e.clientY)
    )

    // Update view zoom
    const newZoom = Math.min(
      Math.max(
        e.deltaY < 0 ? oldZoom * ZOOM_FACTOR : oldZoom / ZOOM_FACTOR,
        ZOOM_BOUNDS.min
      ),
      ZOOM_BOUNDS.max
    )
    paper.view.zoom = newZoom

    // Update view position
    paper.view.center = new Point(
      oldCenter.x + (mousePosition.x - oldCenter.x) * (1 - oldZoom / newZoom),
      oldCenter.y + (mousePosition.y - oldCenter.y) * (1 - oldZoom / newZoom)
    )

    updateAxes(paper.view)
    updateGrid(paper.view)
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
      updateAxes(paper.view)
      updateGrid(paper.view)
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
