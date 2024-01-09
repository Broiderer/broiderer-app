import { Logo } from '../../logo/logo'
import { EditorSettings } from '../editor'
import EditorSidebarFormGrid from './editor-sidebar-forms/editor-sidebar-form-grid/editor-sidebar-form-grid'
import EditorSidebarFromSvg from './editor-sidebar-forms/editor-sidebar-form-svg/editor-sidebar-form-svg'
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

  function handleImportedImportChange(
    importSettings: EditorSettings['import']
  ) {
    updateSettings({ ...settings, import: importSettings })
  }

  return (
    <div className={styles['sidebar-container']}>
      <div className={styles['sidebar-header']}>
        <div className={styles['sidebar-header-logo']}>
          <Logo
            withName
            nameClassName={styles['sidebar-header-logo-name']}
          ></Logo>
        </div>
        <div className={styles['sidebar-header-toggle']}>
          <button
            className="bro-button"
            type="button"
            aria-label="Close sidebar"
          >
            <i className="bro-icon bro-icon-align-left" />
          </button>
        </div>
      </div>
      <div className={styles['sidebar-sections']}>
        <EditorSidebarSection
          title="Import"
          iconClassName="bro-icon-upload"
          initiallyOpened={true}
        >
          <EditorSidebarFromSvg
            updateImportSettings={handleImportedImportChange}
          ></EditorSidebarFromSvg>
        </EditorSidebarSection>
        <EditorSidebarSection
          title="Editor"
          iconClassName="bro-icon-grid"
          initiallyOpened={false}
        >
          <EditorSidebarFormGrid
            gridSettings={settings.grid}
            updateGridSettings={handleGridSettingsChange}
          ></EditorSidebarFormGrid>
        </EditorSidebarSection>
        <EditorSidebarSection
          title="Download"
          iconClassName="bro-icon-save"
          initiallyOpened={false}
        >
          Form download
        </EditorSidebarSection>
      </div>
    </div>
  )
}
