import { ChangeEvent, useState } from 'react'
import { EditorSettings } from '../../../editor'
import SizePicker from '@/app/components/form/size-picker/size-picker'
import { CanvasScale } from '../../../utils/scale'

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
    <form>
      <div>
        <input
          type="checkbox"
          id="axesDisplay"
          checked={gridSettings.displayAxes}
          onChange={axesDisplayedChangeHandler}
        ></input>
        <label htmlFor="axesDisplay">Display axes</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="axesDisplay"
          checked={gridSettings.displayGrid}
          onChange={gridDisplayedChangeHandler}
        ></input>
        <label htmlFor="axesDisplay">Display grid</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="embroideryZoneDisplay"
          checked={gridSettings.displayEmbroideryZone}
          onChange={embroideryZoneDisplayedChangeHandler}
        ></input>
        <label htmlFor="embroideryZoneDisplay">Display embroidery zone</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="pointerPositionDisplay"
          checked={gridSettings.displayPointerPosition}
          onChange={pointerPositionDisplayedChangeHandler}
        ></input>
        <label htmlFor="pointerPositionDisplay">Display pointer position</label>
      </div>

      <div>
        <SizePicker
          valueName="Embroidery zone size"
          value={gridSettings.embroideryZoneSize}
          scale={CanvasScale.CM}
          onValueChanges={embroideryScaleChangeHandler}
        ></SizePicker>
      </div>
    </form>
  )
}
