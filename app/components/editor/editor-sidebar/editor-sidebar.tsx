import { EditorSettings } from '../editor'
import EditorSidebarFormGrid from './editor-sidebar-forms/editor-sidebar-form-grid/editor-sidebar-form-grid'
import EditorSidebarSection from './editor-sidebar-section/editor-sidebar-section'
import styles from './editor-sidebar.module.scss'

export default function EditorSidebar({
  settings,
  updateSettings,
}: {
  settings: EditorSettings
  updateSettings: (settings: EditorSettings) => void
}) {
  function handleGridSettingsChange(gridSettings: EditorSettings['grid']) {
    updateSettings({ ...settings, grid: gridSettings })
  }

  return (
    <div className={styles['sidebar-container']}>
      <EditorSidebarSection title="Editor" initiallyOpened={true}>
        <EditorSidebarFormGrid
          gridSettings={settings.grid}
          updateGridSettings={handleGridSettingsChange}
        ></EditorSidebarFormGrid>
      </EditorSidebarSection>

      <EditorSidebarSection title="SVG">
        Viewport ... Clean ...
      </EditorSidebarSection>
    </div>
  )
}
