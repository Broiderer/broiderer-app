import { ChangeEvent, useState } from 'react'
import { EditorSettings } from '../../../editor'

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
          id="pointerPositionDisplay"
          checked={gridSettings.displayPointerPosition}
          onChange={pointerPositionDisplayedChangeHandler}
        ></input>
        <label htmlFor="pointerPositionDisplay">Display pointer position</label>
      </div>
    </form>
  )
}
