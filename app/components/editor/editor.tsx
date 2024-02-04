'use client'

import { useEffect, useState } from 'react'
import styles from './editro.module.scss'
import EditorSidebar from './editor-sidebar/editor-sidebar'
import EditorCanvas from './editor-canvas/editor-canvas'
import { CanvasScale, scaleToPx } from './utils/scale'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Filling } from './utils/stitch'
import { getDefaultFillingForType } from './editor-canvas/utils/getDefaultFillingForType'
import { storageAvailable } from './utils/localstorage'

export type EditorSettings = {
  navigation: {
    zoom: number
    center: [number, number]
  }
  grid: {
    displayAxes: boolean
    displayGrid: boolean
    displayPointerPosition: boolean
    displayEmbroideryZone: boolean
    embroideryZoneSize: number
  }
  import: {
    initialSvg: string | null
    initialName?: string
    fitBoundsOnImport: boolean
  }
  stitch: {
    global: Filling
  } & { [key: string]: Filling }
}

const ZOOM_BOUNDS = { min: 0.5, max: 5 }

export const DEFAULT_DPI = 72

const DEFAULT_SETTINGS: EditorSettings = {
  navigation: {
    zoom: ZOOM_BOUNDS.min,
    center: [0, 0],
  },
  grid: {
    displayAxes: true,
    displayPointerPosition: false,
    displayGrid: true,
    displayEmbroideryZone: true,
    embroideryZoneSize: scaleToPx(10, CanvasScale.CM, DEFAULT_DPI),
  },
  import: { initialSvg: null, fitBoundsOnImport: false },
  stitch: {
    global: getDefaultFillingForType('linear'),
  },
}

function getLocalstorageInitialSettings(): Partial<EditorSettings> {
  if (!storageAvailable()) {
    return {}
  }
  const gridSettings = localStorage.getItem('broiderer_settings_grid')
  const importSettings = localStorage.getItem('broiderer_settings_import')
  if (!gridSettings || !importSettings) {
    return {}
  }

  return {
    grid: JSON.parse(gridSettings),
    import: JSON.parse(importSettings),
  }
}

export default function Editor() {
  const [settings, setSettings] = useState<EditorSettings>({
    ...DEFAULT_SETTINGS,
    ...getLocalstorageInitialSettings(),
  })

  useEffect(() => {
    if (!storageAvailable()) {
      return
    }
    localStorage.setItem(
      'broiderer_settings_grid',
      JSON.stringify(settings.grid)
    )

    localStorage.setItem(
      'broiderer_settings_import',
      JSON.stringify({ fitBoundsOnImport: settings.import.fitBoundsOnImport })
    )
  }, [settings.grid, settings.import])

  return (
    <TooltipProvider delayDuration={0}>
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
    </TooltipProvider>
  )
}
