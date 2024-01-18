import { ChangeEvent } from 'react'
import { EditorSettings } from '../../../editor'
import SizePicker from '@/app/components/form/size-picker/size-picker'
import { CanvasScale } from '../../../utils/scale'
import styles from './editor-sidebar-form-grid.module.scss'

export default function EditorSidebarFormGrid({
  gridSettings,
  updateGridSettings,
}: {
  gridSettings: EditorSettings['grid']
  updateGridSettings: (settings: EditorSettings['grid']) => void
}) {
  function axesDisplayedChangeHandler(e: ChangeEvent) {
    updateGridSettings({
      ...gridSettings,
      displayAxes: !gridSettings.displayAxes,
    })
  }

  function gridDisplayedChangeHandler(e: ChangeEvent) {
    updateGridSettings({
      ...gridSettings,
      displayGrid: !gridSettings.displayGrid,
    })
  }

  function pointerPositionDisplayedChangeHandler(e: ChangeEvent) {
    updateGridSettings({
      ...gridSettings,
      displayPointerPosition: !gridSettings.displayPointerPosition,
    })
  }

  function embroideryZoneDisplayedChangeHandler(e: ChangeEvent) {
    updateGridSettings({
      ...gridSettings,
      displayEmbroideryZone: !gridSettings.displayEmbroideryZone,
    })
  }

  function embroideryScaleChangeHandler(value: number) {
    updateGridSettings({
      ...gridSettings,
      embroideryZoneSize: value,
    })
  }

  return (
    <form className={styles['editor-sidebar-form-grid']}>
      <div className="bro-checkbox-control">
        <input
          type="checkbox"
          id="axesDisplay"
          checked={gridSettings.displayAxes}
          onChange={axesDisplayedChangeHandler}
        ></input>
        <label htmlFor="axesDisplay">X/Y axes</label>
      </div>

      <div className="bro-checkbox-control">
        <input
          type="checkbox"
          id="gridDisplay"
          checked={gridSettings.displayGrid}
          onChange={gridDisplayedChangeHandler}
        ></input>
        <label htmlFor="gridDisplay">Grid</label>
      </div>

      <div className="bro-checkbox-control">
        <input
          type="checkbox"
          id="embroideryZoneDisplay"
          checked={gridSettings.displayEmbroideryZone}
          onChange={embroideryZoneDisplayedChangeHandler}
        ></input>
        <label htmlFor="embroideryZoneDisplay">Embroidery zone</label>
      </div>

      <div className="bro-checkbox-control">
        <input
          type="checkbox"
          id="pointerPositionDisplay"
          checked={gridSettings.displayPointerPosition}
          onChange={pointerPositionDisplayedChangeHandler}
        ></input>
        <label htmlFor="pointerPositionDisplay">Pointer position</label>
      </div>

      <div className={styles['editor-sidebar-form-grid-size']}>
        <SizePicker
          valueName="Zone size"
          value={gridSettings.embroideryZoneSize}
          scale={CanvasScale.CM}
          onValueChanges={embroideryScaleChangeHandler}
        ></SizePicker>
      </div>
    </form>
  )
}
