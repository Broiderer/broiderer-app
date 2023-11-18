'use client'

import { useState } from 'react'
import * as paper from 'paper'
import styles from './editro.module.scss'
import EditorSidebar from './editor-sidebar/editor-sidebar'
import EditorCanvas from './editor-canvas/editor-canvas'

export type EditorSettings = {
  grid: {
    displayAxes: boolean
    displayGrid: boolean
    displayPointerPosition: boolean
  }
}

const DEFAULT_SETTINGS: EditorSettings = {
  grid: { displayAxes: true, displayPointerPosition: true, displayGrid: true },
}

export default function Editor() {
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS)

  function handleSettingsChanged(settings: EditorSettings) {
    setSettings(settings)
  }

  return (
    <div className={styles['editor-container']}>
      <div className={styles['editor-layout']}>
        <EditorSidebar
          settings={settings}
          updateSettings={handleSettingsChanged}
        ></EditorSidebar>
        <EditorCanvas settings={settings}></EditorCanvas>
      </div>
    </div>
  )
}
