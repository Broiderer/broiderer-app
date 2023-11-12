import EditorSidebarFormGrid from './editor-sidebar-forms/editor-sidebar-form-grid/editor-sidebar-form-grid'
import EditorSidebarSection from './editor-sidebar-section/editor-sidebar-section'
import styles from './editor-sidebar.module.scss'

export default function EditorSidebar() {
  return (
    <div className={styles['sidebar-container']}>
      <EditorSidebarSection title="Editor" initiallyOpened={true}>
        <EditorSidebarFormGrid></EditorSidebarFormGrid>
      </EditorSidebarSection>

      <EditorSidebarSection title="SVG">
        Viewport ... Clean ...
      </EditorSidebarSection>
    </div>
  )
}
