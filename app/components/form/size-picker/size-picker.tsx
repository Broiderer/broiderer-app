import { ChangeEvent, useState } from 'react'
import { CanvasScale, pxToScale, scaleToPx } from '../../editor/utils/scale'
import styles from './size-picker.module.scss'
import { DEFAULT_DPI } from '../../editor/editor'
import SelectOptions from '../select/select'

type SizePickerProps = {
  valueName: string
  value: number
  scale: CanvasScale
  onValueChanges: Function
}

const minMaxForScale: { [key in CanvasScale]: [number, number] } = {
  px: [1, 1000],
  mm: [1, 1_000],
  cm: [1, 100],
}

export default function SizePicker({
  valueName,
  value,
  scale: initialScale,
  onValueChanges,
}: SizePickerProps) {
  const [scale, setScale] = useState(initialScale)

  function onValueChangeHandler(e: ChangeEvent) {
    onValueChanges(
      scaleToPx(
        Number((e.target as HTMLInputElement).value),
        scale,
        DEFAULT_DPI
      )
    )
  }

  return (
    <div className={styles['size-picker']}>
      <div className={styles['size-picker-value']}>
        <label htmlFor="size-picker-value">{valueName}</label>
        <input
          type="number"
          step=".01"
          value={pxToScale(value, scale, DEFAULT_DPI).toFixed(2)}
          min={minMaxForScale[scale][0]}
          max={minMaxForScale[scale][1]}
          id="size-picker-value"
          onChange={onValueChangeHandler}
          className="bro-input"
        ></input>
      </div>

      <div>
        <SelectOptions
          value={scale}
          options={Object.values(CanvasScale)}
          onValueChange={(val) => setScale(val as CanvasScale)}
        ></SelectOptions>
      </div>
    </div>
  )
}
