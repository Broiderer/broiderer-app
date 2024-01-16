import {
  MouseEvent,
  WheelEvent,
  useEffect,
  useState,
  createRef,
  SetStateAction,
  Dispatch,
  KeyboardEvent,
} from 'react'
import styles from './editor-canvas.module.scss'
import { Point } from 'paper/dist/paper-core'
import * as paper from 'paper'
import { EditorSettings } from '../editor'
import EditorCursor from '../editor-cursor/editor-cursor'
import { getStiches } from '../utils/stitch'
import getPathChildren, { setPathsInitialIds } from './utils/getPathChildren'
import EditorPaths from '../editor-paths/editor-paths'

const ZOOM_FACTOR = 1.05
export const ZOOM_BOUNDS = { min: 0.1, max: 100 }
const GRID_GAP = 50
const ADDITIONAL_STITCHES = { head: 3, tail: 3 }

const EditorCanvas = ({
  settings,
  onSettingsChange,
}: {
  settings: EditorSettings
  onSettingsChange: Dispatch<SetStateAction<EditorSettings>>
}) => {
  const canvasRef = createRef<HTMLCanvasElement>()
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [viewLoaded, setViewLoaded] = useState<boolean>(false)
  const [importedPaths, setImportedPaths] = useState<
    (paper.Path | paper.CompoundPath)[]
  >([])

  useEffect(() => {
    if (canvasRef?.current) {
      paper.install(document)
      paper.setup(canvasRef.current)

      paper.project.currentStyle.strokeWidth = 0.5

      const gridLayer = new paper.Layer()
      gridLayer.name = 'broiderer-grid'

      const axesLayer = new paper.Layer()
      axesLayer.name = 'broiderer-axes'

      const embroideryZoneLayer = new paper.Layer()
      embroideryZoneLayer.name = 'broiderer-embroidery-zone'

      const testLayer = new paper.Layer()
      testLayer.name = 'broiderer-test-stitch'

      setViewLoaded(true)
    }
  }, [])

  useEffect(() => {
    paper.view.zoom = settings.navigation.zoom
    paper.view.center = new Point(settings.navigation.center)

    updateAxes(paper.view)
    updateGrid(paper.view)
    updateEmbroideryZone()
  }, [settings.navigation.zoom, settings.navigation.center, settings.grid])

  useEffect(() => {
    if (settings.import.initialSvg) {
      paper.project.layers
        .find((layer) => layer.name === 'broiderer-import')
        ?.remove()

      const importedLayer = new paper.Layer()
      importedLayer.name = 'broiderer-import'
      importedLayer.opacity = 0

      importedLayer.importSVG(settings.import.initialSvg)

      setPathsInitialIds(importedLayer)

      paper.project.addLayer(importedLayer)

      updateEmbroideryLayers()
    }
  }, [settings.import.initialSvg])

  useEffect(() => {
    updateEmbroideryLayers()
  }, [settings.stitch])

  function updateEmbroideryLayers(computeStitches: boolean = true) {
    const importLayer = paper.project.layers.find(
      (layer) => layer.name === 'broiderer-import'
    )

    const testStitchLayer = paper.project.layers.find(
      (layer) => layer.name === 'broiderer-test-stitch'
    )

    if (!testStitchLayer || !importLayer) {
      return
    }

    const pathChildren = getPathChildren(importLayer, true)
      .reverse()
      .filter((path) => !path.data['broiderer-removed'] && path.pathData)
      .map((path, i, self) => {
        for (let j = 0; j < i; j++) {
          path = path.subtract(self[j], { insert: false }) as paper.Path
        }
        return path
      })

    for (const pathChild of pathChildren) {
      pathChild.closePath()
    }

    setImportedPaths(pathChildren.map((path) => path.clone({ insert: false })))

    const stitchLayerSave = testStitchLayer.clone({ insert: false })
    testStitchLayer.removeChildren()

    for (const pathChild of pathChildren) {
      let path = new paper.Path()
      const matchingPath = getPathChildren(stitchLayerSave).find(
        (path) =>
          path.data['broiderer-import-id'] ===
          pathChild.data['broiderer-import-id']
      )
      if (!computeStitches && matchingPath) {
        path = matchingPath as paper.Path
      } else {
        const newPathPoints = getStiches(pathChild, settings.stitch.global)

        if (newPathPoints.length === 0) {
          break
        }

        const firstPoint = newPathPoints[0]
        for (let i = 0; i < ADDITIONAL_STITCHES.head; i++) {
          newPathPoints.unshift(firstPoint)
        }
        const lastPoint = newPathPoints[newPathPoints.length - 1]
        for (let i = 0; i < ADDITIONAL_STITCHES.tail; i++) {
          newPathPoints.push(lastPoint)
        }

        for (const stitch of newPathPoints) {
          path.add(new paper.Segment(new paper.Point([stitch.x, stitch.y])))
        }
        path.data = pathChild.data
      }
      path.strokeColor = pathChild.fillColor
      testStitchLayer.addChild(path)
    }
  }

  function updateAxes(view: paper.View) {
    const axesLayer = paper.project.layers.find(
      (layer) => layer.name === 'broiderer-axes'
    )

    const axesAlreadyDrawn = axesLayer?.hasChildren()

    if (!settings.grid.displayAxes) {
      axesLayer?.removeChildren()
      return
    }

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

  function updateEmbroideryZone() {
    const emZoneLayer = paper.project.layers.find(
      (layer) => layer.name === 'broiderer-embroidery-zone'
    )

    const emZoneAlreadyDrawn = emZoneLayer?.hasChildren()

    if (!settings.grid.displayEmbroideryZone) {
      emZoneLayer?.removeChildren()
      return
    }

    const zoneSizeInPx = settings.grid.embroideryZoneSize

    if (emZoneAlreadyDrawn) {
      // If axes are already drawn, update their positions
      const zone = emZoneLayer?.children.find(
        (child) => child.name === 'broiderer-embroidery-zone-path'
      ) as paper.Path

      zone.segments[1].point = new paper.Point([zoneSizeInPx, 0])
      zone.segments[2].point = new paper.Point([zoneSizeInPx, zoneSizeInPx])
      zone.segments[3].point = new paper.Point([0, zoneSizeInPx])
    } else {
      // If axes are not drawn, create and add them to the gridLayer
      const zone = new paper.Path()
      zone.name = 'broiderer-embroidery-zone-path'
      zone.moveTo(new paper.Point(0, 0))
      zone.lineTo(new paper.Point(zoneSizeInPx, 0))
      zone.lineTo(new paper.Point(zoneSizeInPx, zoneSizeInPx))
      zone.lineTo(new paper.Point(0, zoneSizeInPx))
      zone.closePath()
      zone.strokeColor = new paper.Color('red')
      zone.style.strokeWidth = 2
      emZoneLayer?.addChild(zone)
    }
  }

  function updateGrid(view: paper.View) {
    const gridLayer = paper.project.layers.find(
      (layer) => layer.name === 'broiderer-grid'
    )

    if (!settings.grid.displayGrid) {
      gridLayer?.removeChildren()
      return
    }

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
    const oldZoom = settings.navigation.zoom
    const oldCenter = settings.navigation.center
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

    onSettingsChange((settings) => {
      settings.navigation.center = [
        oldCenter[0] +
          (mousePosition.x - oldCenter[0]) * (1 - oldZoom / newZoom),
        oldCenter[1] +
          (mousePosition.y - oldCenter[1]) * (1 - oldZoom / newZoom),
      ]
      settings.navigation.zoom = newZoom
      return { ...settings }
    })
  }

  function mouseDownHandler(e: MouseEvent<HTMLCanvasElement>) {
    setIsDragging(true)
  }

  function mouseUpHandler(e: MouseEvent<HTMLCanvasElement>) {
    if (isDragging) {
      onSettingsChange((settings) => {
        settings.navigation.center = [paper.view.center.x, paper.view.center.y]
        return { ...settings }
      })
      setIsDragging(false)
    }
  }

  function mouseOutHandler(e: MouseEvent<HTMLCanvasElement>) {
    if (isDragging) {
      onSettingsChange((settings) => {
        settings.navigation.center = [paper.view.center.x, paper.view.center.y]
        return { ...settings }
      })
      setIsDragging(false)
    }
  }

  function mouseMoveHandler(e: MouseEvent<HTMLCanvasElement>) {
    if (isDragging) {
      //  Optimization for not re-rendering on every mousemove
      paper.view.center = new Point([
        paper.view.center.x - e.movementX / paper.view.zoom,
        paper.view.center.y - e.movementY / paper.view.zoom,
      ])

      updateAxes(paper.view)
      updateGrid(paper.view)
      updateEmbroideryZone()
    }
  }

  function keyDownHandler(e: KeyboardEvent<HTMLCanvasElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      return
    }
    e.preventDefault()
    const panSpeed = 10
    const zoomSpeed = 1.2

    onSettingsChange((settings) => {
      const panDistance = panSpeed / settings.navigation.zoom
      const center = settings.navigation.center
      switch (e.key) {
        case 'ArrowLeft':
          settings.navigation.center = [center[0] - panDistance, center[1]]
          break
        case 'ArrowRight':
          settings.navigation.center = [center[0] + panDistance, center[1]]
          break
        case 'ArrowUp':
          if (e.ctrlKey || e.metaKey) {
            settings.navigation.zoom *= zoomSpeed
          } else {
            settings.navigation.center = [center[0], center[1] - panDistance]
          }
          break
        case 'ArrowDown':
          if (e.ctrlKey || e.metaKey) {
            settings.navigation.zoom /= zoomSpeed
          } else {
            settings.navigation.center = [center[0], center[1] + panDistance]
          }
          break
        default:
          break
      }
      return { ...settings }
    })
  }

  function onPathChangeHandler(
    oldPathId: number,
    name: 'fillColor',
    value: paper.Color
  ) {
    const importLayer = paper.project.layers.find(
      (layer) => layer.name === 'broiderer-import'
    )
    if (!importLayer) {
      return
    }
    const matchingChild = getPathChildren(importLayer, false).find(
      (child) => child.data['broiderer-import-id'] === oldPathId
    )
    if (matchingChild) {
      matchingChild[name] = value
    }
    updateEmbroideryLayers(false)
  }

  function onToggleRemovePathHandler(pathImportId: number) {
    const importLayer = paper.project.layers.find(
      (layer) => layer.name === 'broiderer-import'
    )
    if (!importLayer) {
      return
    }
    const matchingChild = getPathChildren(importLayer, false).find(
      (child) => child.data['broiderer-import-id'] === pathImportId
    )
    if (matchingChild) {
      matchingChild.data['broiderer-removed'] =
        !matchingChild.data['broiderer-removed']
    }
    updateEmbroideryLayers()
  }

  function stitchSettingsChanged(stitchSettings: EditorSettings['stitch']) {
    onSettingsChange({ ...settings, stitch: stitchSettings })
  }

  return (
    <div className={styles['editor-canvas']}>
      {canvasRef && viewLoaded && settings.grid.displayPointerPosition && (
        <EditorCursor
          paperView={paper.view}
          canvasRef={canvasRef}
          zoom={settings.navigation.zoom}
        ></EditorCursor>
      )}
      {/*  <EditorNavigation onSettingsChange={onSettingsChange}></EditorNavigation> */}
      {settings.import.initialSvg && (
        <EditorPaths
          paths={importedPaths}
          updatePath={onPathChangeHandler}
          toggleRemovePath={onToggleRemovePathHandler}
          stitchSettings={settings.stitch}
          updateStitchSettings={stitchSettingsChanged}
        ></EditorPaths>
      )}
      <canvas
        className={`${styles['editor-canvas-layout']} ${
          isDragging ? styles['dragging'] : ''
        }`}
        tabIndex={0}
        ref={canvasRef}
        onWheel={wheelHandler}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onMouseOut={mouseOutHandler}
        onMouseMove={mouseMoveHandler}
        onKeyDown={keyDownHandler}
      ></canvas>
    </div>
  )
}

export default EditorCanvas
