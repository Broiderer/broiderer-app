import { ChangeEvent, useState } from 'react'

export default function EditorSidebarFormGrid() {
  const [areAxesDisplayed, setAreAxesDisplayed] = useState(true)

  function axesDisplayedChangeHandler(e: ChangeEvent) {
    setAreAxesDisplayed((state) => !state)
  }

  return (
    <form>
      <div>
        <input
          type="checkbox"
          id="axesDisplay"
          checked={areAxesDisplayed}
          onChange={axesDisplayedChangeHandler}
        ></input>
        <label htmlFor="axesDisplay">Display axes</label>
      </div>
    </form>
  )
}
