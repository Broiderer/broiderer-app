import EditorPath from './editor-path/editor-path'
import styles from './editor-paths.module.scss'

type EditorPathsProps = {
  paths: (paper.Path | paper.CompoundPath)[]
  updatePath: (oldPathId: number, name: 'fillColor', value: paper.Color) => void
  toggleRemovePath: (oldPathId: number) => void
}

export default function EditorPaths({
  paths,
  updatePath,
  toggleRemovePath,
}: EditorPathsProps) {
  return (
    <div className={styles['editor-paths']}>
      <ul className={styles['editor-paths-list']}>
        {paths.map((path) => (
          <li
            key={path.data['broiderer-import-id']}
            className={styles['editor-paths-list-item']}
          >
            <EditorPath
              path={path}
              updatePath={updatePath}
              toggleRemovePath={toggleRemovePath}
            ></EditorPath>
          </li>
        ))}
      </ul>
    </div>
  )
}
