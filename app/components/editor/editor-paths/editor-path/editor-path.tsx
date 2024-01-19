import * as paper from 'paper'

import styles from './editor-path.module.scss'
import { ChangeEvent, useMemo } from 'react'
import EditorSidebarSection from '../../editor-sidebar/editor-sidebar-section/editor-sidebar-section'
import FillingForm from '../filling-form/filling-form'
import { EditorSettings } from '../../editor'

type EditorPathProps = {
  path: paper.Path | paper.CompoundPath
  updatePath: (oldPathId: number, name: 'fillColor', value: paper.Color) => void
  toggleRemovePath: (oldPathId: number) => void
  settings: EditorSettings['stitch']
  updateSettings: (settings: EditorSettings['stitch']) => void
}

export default function EditorPath({
  path,
  settings,
  updateSettings,
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

  function clearCustomFilling() {
    updateSettings({
      ...settings,
      [path.data['broiderer-import-id']]: undefined,
    })
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
        <EditorSidebarSection
          initiallyOpened={false}
          title="Options"
          className={styles['editor-path-form-toggle']}
        >
          <div className={styles['editor-path-form-content']}>
            <div className={styles['editor-path-form-content-control']}>
              <label htmlFor={`color-input-${path.id}`}>Color</label>
              <input
                type="color"
                id={`color-input-${path.id}`}
                value={path.fillColor?.toCSS(true)}
                onChange={colorChangeHandler}
              />
            </div>

            <FillingForm
              filling={
                settings[path.data['broiderer-import-id']] || settings['global']
              }
              onUpdateFilling={(filling) =>
                updateSettings({
                  ...settings,
                  [path.data['broiderer-import-id']]: filling,
                })
              }
            ></FillingForm>

            {settings[path.data['broiderer-import-id']] && (
              <button
                type="button"
                onClick={clearCustomFilling}
                className="bro-button"
              >
                🌐 Reset To Global
              </button>
            )}

            <button
              type="button"
              onClick={deletePathHandler}
              className="bro-button"
            >
              🚨 {isRemoved ? 'Activate' : 'Remove'}
            </button>
          </div>
        </EditorSidebarSection>
      </form>
    </div>
  )
}
