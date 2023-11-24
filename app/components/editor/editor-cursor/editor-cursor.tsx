import { RefObject, useEffect, useState } from 'react'
import styles from './editor-cursor.module.scss'

export default function EditorCursor({
  canvasRef,
  paperView,
  zoom,
}: {
  canvasRef: RefObject<HTMLCanvasElement>
  paperView: paper.View
  zoom: number
}) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!paperView) {
      return
    }
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({
        x: Math.round(e.offsetX / paperView.zoom + paperView.bounds.left),
        y: Math.round(e.offsetY / paperView.zoom + paperView.bounds.top),
      })
    }

    canvasRef.current?.addEventListener('mousemove', handleMouseMove)

    return () => {
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove)
    }
  }, [paperView, canvasRef])

  return (
    <div className={styles['editor-cursor']}>
      <div className={styles['editor-cursor-position']}>
        <span className={styles['editor-cursor-position-name']}>x </span>
        <span className={styles['editor-cursor-position-value']}>
          {cursorPosition.x}
        </span>
      </div>
      <div className={styles['editor-cursor-position']}>
        <span className={styles['editor-cursor-position-name']}>y </span>
        <span className={styles['editor-cursor-position-value']}>
          {cursorPosition.y}
        </span>
      </div>
      <div className={styles['editor-cursor-position']}>
        <span className={styles['editor-cursor-position-name']}>z </span>
        <span className={styles['editor-cursor-position-value']}>
          {zoom.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
