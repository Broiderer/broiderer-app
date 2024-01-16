import { Dispatch, SetStateAction } from 'react'
import styles from './editor-navigation.module.scss'
import { EditorSettings } from '../editor'
import { ZOOM_BOUNDS } from '../editor-canvas/editor-canvas'

export default function EditorNavigation({
  onSettingsChange,
}: {
  onSettingsChange: Dispatch<SetStateAction<EditorSettings>>
}) {
  function onZoomInClicked() {
    onSettingsChange((settings) => {
      settings.navigation.zoom = Math.min(
        ZOOM_BOUNDS.max,
        settings.navigation.zoom + 1
      )
      return { ...settings }
    })
  }

  function onZoomOutClicked() {
    onSettingsChange((settings) => {
      settings.navigation.zoom = Math.max(
        ZOOM_BOUNDS.min,
        settings.navigation.zoom - 1
      )
      return { ...settings }
    })
  }

  return (
    <div className={styles['editor-navigation']}>
      <ul>
        <li>
          <button type="button" onClick={onZoomInClicked}>
            Zoom in
          </button>
        </li>
        <li>
          <button type="button" onClick={onZoomOutClicked}>
            Zoom out
          </button>
        </li>
      </ul>
    </div>
  )
}
