'use client'

import { useRef } from 'react'
import * as paper from 'paper'
import styles from './editro.module.scss'
import EditorCursor from './editor-cursor/editor-cursor'
import EditorSidebar from './editor-sidebar/editor-sidebar'
import EditorCanvas from './editor-canvas/editor-canvas'

paper.install(document)

export default function Editor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <div className={styles['editor-container']}>
      {canvasRef && paper.view && (
        <EditorCursor
          canvasRef={canvasRef}
          paperView={paper.view}
        ></EditorCursor>
      )}
      <div className={styles['editor-layout']}>
        <EditorSidebar></EditorSidebar>
        <EditorCanvas ref={canvasRef}></EditorCanvas>
      </div>
    </div>
  )
}
