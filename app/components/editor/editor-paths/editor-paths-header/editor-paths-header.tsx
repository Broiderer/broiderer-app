import EditorSidebarToggle from '../../editor-sidebar/editro-sidebar-toggle/editro-sidebar-toggle'
import styles from './editor-paths-header.module.scss'

export default function EditorPathHeader({
  count,
  isPathsOpen,
  onPathsToggled,
}: {
  count: number
  isPathsOpen: boolean
  onPathsToggled: () => void
}) {
  return (
    <div>
      <div className={styles['editor-path-header-title']}>
        Imported elements
      </div>
      <div className={styles['editor-path-header-subtitle']}>
        {count > 0 ? (
          <div className={styles['editor-path-header-subtitle-elements']}>
            <EditorSidebarToggle
              isSidebarOpen={isPathsOpen}
              onToggleClicked={onPathsToggled}
              inverted
            ></EditorSidebarToggle>
            <div
              className={styles['editor-path-header-subtitle-elements-count']}
            >
              {count} elements
            </div>
          </div>
        ) : (
          <p className="bro-muted">
            No stitchable elements were found in the imported svg
          </p>
        )}
      </div>
    </div>
  )
}
