import { RefObject, useEffect, useState } from 'react'
import styles from './editor-cursor.module.scss'

export default function EditorCursor({
  canvasRef,
  paperView,
}: {
  canvasRef: RefObject<HTMLCanvasElement>
  paperView: paper.View
}) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
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
  }, [])

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
    </div>
  )
}
