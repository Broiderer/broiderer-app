import { useState } from 'react'
import EditorPath from './editor-path/editor-path'
import EditorPathHeader from './editor-paths-header/editor-paths-header'
import styles from './editor-paths.module.scss'
import EditorPathsGlobal from './editor-paths-global/editor-paths-global'
import { EditorSettings } from '../editor'

type EditorPathsProps = {
  paths: (paper.Path | paper.CompoundPath)[]
  updatePath: (oldPathId: number, name: 'fillColor', value: paper.Color) => void
  toggleRemovePath: (oldPathId: number) => void
  stitchSettings: EditorSettings['stitch']
  updateStitchSettings: (val: EditorSettings['stitch']) => void
}

export default function EditorPaths({
  paths,
  updatePath,
  toggleRemovePath,
  stitchSettings,
  updateStitchSettings,
}: EditorPathsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  return (
    <div className={styles['editor-paths']}>
      <EditorPathHeader
        count={paths.length}
        isPathsOpen={isOpen}
        onPathsToggled={() => setIsOpen((prev) => !prev)}
      ></EditorPathHeader>
      {isOpen && paths.length > 0 && (
        <>
          <EditorPathsGlobal
            globalFilling={stitchSettings.global}
            updateGlobalFilling={(newGlobalFilling) =>
              updateStitchSettings({
                ...stitchSettings,
                global: newGlobalFilling,
              })
            }
          ></EditorPathsGlobal>
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
        </>
      )}
    </div>
  )
}
