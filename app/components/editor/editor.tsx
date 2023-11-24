'use client'

import { useState } from 'react'
import * as paper from 'paper'
import styles from './editro.module.scss'
import EditorSidebar from './editor-sidebar/editor-sidebar'
import EditorCanvas from './editor-canvas/editor-canvas'

export type EditorSettings = {
  navigation: {
    zoom: number
    center: [number, number]
  }
  grid: {
    displayAxes: boolean
    displayGrid: boolean
    displayPointerPosition: boolean
  }
  import: {
    initialSvg: string | null
  }
}

const ZOOM_BOUNDS = { min: 0.5, max: 5 }

const DEFAULT_SETTINGS: EditorSettings = {
  navigation: { zoom: ZOOM_BOUNDS.min, center: [0, 0] },
  grid: { displayAxes: true, displayPointerPosition: true, displayGrid: true },
  import: { initialSvg: null },
}

export default function Editor() {
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS)

  return (
    <div className={styles['editor-container']}>
      <div className={styles['editor-layout']}>
        <EditorSidebar
          settings={settings}
          updateSettings={setSettings}
        ></EditorSidebar>
        <EditorCanvas
          settings={settings}
          onSettingsChange={setSettings}
        ></EditorCanvas>
      </div>
    </div>
  )
}
