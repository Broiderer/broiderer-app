import * as paper from 'paper'

import styles from './editor-path.module.scss'
import { ChangeEvent, useMemo } from 'react'
import EditorSidebarSection from '../../editor-sidebar/editor-sidebar-section/editor-sidebar-section'

type EditorPathProps = {
  path: paper.Path | paper.CompoundPath
  updatePath: (oldPathId: number, name: 'fillColor', value: paper.Color) => void
  toggleRemovePath: (oldPathId: number) => void
}

export default function EditorPath({
  path,
  updatePath,
  toggleRemovePath,
}: EditorPathProps) {
  path.strokeWidth = 0.5
  path.strokeColor = new paper.Color('black')
  const isRemoved = Boolean(path.data['broiderer-removed'])
  const pathNode = useMemo(() => path.exportSVG({ asString: true }), [path])

  function colorChangeHandler(event: ChangeEvent) {
    updatePath(
      path.data['broiderer-import-id'],
      'fillColor',
      new paper.Color((event.target as HTMLInputElement).value)
    )
  }

  function deletePathHandler() {
    toggleRemovePath(path.data['broiderer-import-id'])
  }

  return (
    <div className={styles['editor-path']}>
      {!isRemoved && (
        <div className={styles['editor-path-image']}>
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox={`${path.bounds.left - 1} ${path.bounds.top - 1} ${
              path.bounds.width + 2
            } ${path.bounds.height + 2}`}
            dangerouslySetInnerHTML={{ __html: pathNode }}
          ></svg>
        </div>
      )}
      <form className={styles['editor-path-form']}>
        <EditorSidebarSection initiallyOpened={false} title="Options">
          <label htmlFor={`color-input-${path.id}`}>Color</label>
          <input
            type="color"
            id={`color-input-${path.id}`}
            value={path.strokeColor?.toCSS(true)}
            onChange={colorChangeHandler}
          />

          <button type="button" onClick={deletePathHandler}>
            {isRemoved ? 'Activate' : 'Remove'}
          </button>
        </EditorSidebarSection>
      </form>
    </div>
  )
}
