import { Filling } from '@/app/components/test-editor-2/utils/fillStitches3'
import styles from './editor-paths-global.module.scss'
import FillingForm from '../filling-form/filling-form'

export default function EditorPathsGlobal({
  globalFilling,
  updateGlobalFilling,
}: {
  globalFilling: Filling
  updateGlobalFilling: (filling: Filling) => void
}) {
  return (
    <div className={styles['editor-paths-global']}>
      <div className={styles['editor-paths-global-title']}>Global filling</div>
      <FillingForm
        filling={globalFilling}
        onUpdateFilling={updateGlobalFilling}
      ></FillingForm>
    </div>
  )
}
