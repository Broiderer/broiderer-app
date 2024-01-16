import SelectOptions from '@/app/components/select/select'
import { Filling } from '@/app/components/test-editor-2/utils/fillStitches3'
import { getDefaultFillingForType } from '../../editor-canvas/utils/getDefaultFillingForType'
import styles from './filling-form.module.scss'
import { ChangeEvent } from 'react'

type FillingFormProps = {
  filling: Filling
  onUpdateFilling: (filling: Filling) => void
}

export default function FillingForm({
  filling,
  onUpdateFilling,
}: FillingFormProps) {
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

  function updateFillingAngleHandler(event: ChangeEvent<HTMLInputElement>) {
    const value = (Number(event.target.value) * Math.PI) / 180

    if (value < 0) {
      return
    }

    onUpdateFilling({ ...filling, angle: value } as Filling)
  }

  return (
    <form className={styles['filling-form']}>
      <div className={styles['filling-form-control']}>
        <label>Fill type</label>
        <SelectOptions
          options={['linear']}
          value={filling.type}
          onValueChange={(val) =>
            fillingTypeChangeHandler(val as Filling['type'])
          }
        ></SelectOptions>
      </div>
      {filling.type === 'linear' && (
        <>
          <div className={styles['filling-form-control']}>
            <label htmlFor="filling-gap">Gap</label>
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
            <label htmlFor="filling-inner-gap">Inner gap</label>
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
            <label htmlFor="Angle">Angle</label>
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
        </>
      )}
    </form>
  )
}
