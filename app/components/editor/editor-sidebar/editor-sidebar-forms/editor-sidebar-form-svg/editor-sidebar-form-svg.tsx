import { ChangeEvent } from 'react'
import { EditorSettings } from '../../../editor'

export default function EditorSidebarFromSvg({
  updateImportSettings,
}: {
  updateImportSettings: (settings: EditorSettings['import']) => void
}) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    const file = (target.files || [])[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const svgContent = e.target?.result
        if (svgContent) {
          updateImportSettings({ initialSvg: svgContent as string })
        }
      }

      reader.readAsText(file)
    }
  }

  return (
    <form>
      <div>
        <input type="file" id="svgInput" onChange={handleFileChange} />
        <label htmlFor="svgInput">Import SVG</label>
      </div>
    </form>
  )
}
