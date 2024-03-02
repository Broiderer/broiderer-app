import SelectOptions from '@/app/components/form/select/select'
import {
  AlongFilling,
  Filling,
  LinearFilling,
} from '@/app/components/editor/utils/stitch'
import { getDefaultFillingForType } from '../../editor-canvas/utils/getDefaultFillingForType'
import styles from './filling-form.module.scss'
import { ChangeEvent } from 'react'
import * as paper from 'paper'
import { getPathChildren } from '../../editor-canvas/utils/getPathChildren'

type FillingFormProps = {
  filling: Filling
  onUpdateFilling: (filling: Filling) => void
}

export default function FillingForm({
  filling,
  onUpdateFilling,
}: FillingFormProps) {
  const importLayer = paper.project.layers.find(
    (layer) => layer.name === 'broiderer-import'
  )
  const pathChildren = importLayer ? getPathChildren(importLayer) : []

  function fillingTypeChangeHandler(newFillingType: Filling['type']) {
    onUpdateFilling(getDefaultFillingForType(newFillingType))
  }

  function updateFillingInputHandler(
    property: string,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const value = Number(event.target.value)
    if (!value || value < 0 || isNaN(value)) {
      return
    }
    onUpdateFilling({ ...filling, [property]: value })
  }

  function updateFillingRandomizeFirstStepHandler(
    currFilling: AlongFilling | LinearFilling
  ) {
    onUpdateFilling({
      ...currFilling,
      randomizeFirstStep: !currFilling.randomizeFirstStep,
    })
  }

  function updateFillingAngleHandler(event: ChangeEvent<HTMLInputElement>) {
    const value = (Number(event.target.value) * Math.PI) / 180

    if (value < 0) {
      return
    }

    onUpdateFilling({ ...filling, angle: value } as Filling)
  }

  function updateFillingAddStitchHandler(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value)

    if (value < 0) {
      return
    }

    onUpdateFilling({ ...filling, additionalStitches: value } as Filling)
  }

  function fillingAlongPathChangeHandler(selectedPath: string) {
    const matching = pathChildren.find(
      (child) => child.data['broiderer-import-id'] === selectedPath
    )
    if (!matching) {
      return
    }
    onUpdateFilling({
      ...filling,
      path: matching,
    } as Filling)
  }

  return (
    <div className={styles['filling-form']}>
      <div className={styles['filling-form-control']}>
        <label className="bro-muted">Fill type</label>
        <SelectOptions
          options={['linear', 'along', 'stroke']}
          value={filling.type}
          onValueChange={(val) =>
            fillingTypeChangeHandler(val as Filling['type'])
          }
        ></SelectOptions>
      </div>
      {filling.type === 'linear' && (
        <>
          <div className={styles['filling-form-control']}>
            <label htmlFor="filling-gap" className="bro-muted">
              Gap
            </label>
            <input
              type="number"
              step=".1"
              value={filling.gap}
              min={0.5}
              id="filling-gap"
              onChange={(e) => updateFillingInputHandler('gap', e)}
              className="bro-input"
            ></input>
          </div>
          <div className={styles['filling-form-control']}>
            <label htmlFor="filling-inner-gap" className="bro-muted">
              Inner gap
            </label>
            <input
              type="number"
              value={filling.innerGap}
              min={1}
              id="filling-inner-gap"
              onChange={(e) => updateFillingInputHandler('innerGap', e)}
              className="bro-input"
            ></input>
          </div>
          <div className={styles['filling-form-control']}>
            <label htmlFor="filling-angle" className="bro-muted">
              Angle
            </label>
            <input
              type="number"
              value={Math.round((filling.angle * 180) / Math.PI)}
              min={0}
              max={360}
              id="filling-angle"
              onChange={(e) => updateFillingAngleHandler(e)}
              className="bro-input"
            ></input>
          </div>

          <div className={`bro-checkbox-control`}>
            <input
              type="checkbox"
              id="fit-bounds-on-import"
              className="bro-muted"
              checked={Boolean(filling.randomizeFirstStep)}
              onChange={() => updateFillingRandomizeFirstStepHandler(filling)}
            ></input>
            <label htmlFor="fit-bounds-on-import">Randomize first step</label>
          </div>
        </>
      )}

      {filling.type === 'along' && (
        <>
          <div className={styles['filling-form-control']}>
            <label htmlFor="filling-gap" className="bro-muted">
              Gap
            </label>
            <input
              type="number"
              step=".1"
              value={filling.gap}
              min={0.5}
              id="filling-gap"
              onChange={(e) => updateFillingInputHandler('gap', e)}
              className="bro-input"
            ></input>
          </div>
          <div className={styles['filling-form-control']}>
            <label htmlFor="filling-inner-gap" className="bro-muted">
              Inner gap
            </label>
            <input
              type="number"
              value={filling.innerGap}
              min={1}
              id="filling-inner-gap"
              onChange={(e) => updateFillingInputHandler('innerGap', e)}
              className="bro-input"
            ></input>
          </div>

          <div className={styles['filling-form-control']}>
            <label className="bro-muted">Along</label>
            <SelectOptions
              options={(pathChildren || [])
                .filter((path) => path.opacity === 0)
                .map((path) => path.data['broiderer-import-id'])
                .concat('None')}
              value={filling.path.data['broiderer-import-id'] || 'None'}
              onValueChange={(val) => fillingAlongPathChangeHandler(val)}
            ></SelectOptions>
          </div>

          <div className={styles['filling-form-control']}>
            <label htmlFor="filling-offset" className="bro-muted">
              Offset
            </label>
            <input
              type="number"
              value={filling.offset}
              min={1}
              id="filling-offset"
              onChange={(e) => updateFillingInputHandler('offset', e)}
              className="bro-input"
            ></input>
          </div>

          <div
            className={`${styles['filling-form-control']} bro-checkbox-control`}
          >
            <input
              type="checkbox"
              id="fit-bounds-on-import"
              className="bro-muted"
              checked={Boolean(filling.randomizeFirstStep)}
              onChange={() => updateFillingRandomizeFirstStepHandler(filling)}
            ></input>
            <label htmlFor="fit-bounds-on-import">Randomize first step</label>
          </div>
        </>
      )}

      {filling.type === 'stroke' && (
        <>
          <div className={styles['filling-form-control']}>
            <label htmlFor="filling-gap" className="bro-muted">
              Gap
            </label>
            <input
              type="number"
              step=".1"
              value={filling.gap}
              min={0.5}
              id="filling-gap"
              onChange={(e) => updateFillingInputHandler('gap', e)}
              className="bro-input"
            ></input>
          </div>
        </>
      )}

      <div className={styles['filling-form-control']}>
        <label htmlFor="additional-stitch" className="bro-muted">
          Additional stitches
        </label>
        <input
          type="number"
          value={filling.additionalStitches}
          min={0}
          max={10}
          id="additional-stitch"
          onChange={(e) => updateFillingAddStitchHandler(e)}
          className="bro-input"
        ></input>
      </div>
    </div>
  )
}
