'use client'

import dynamic from 'next/dynamic'
import styles from './styles.module.scss'

const DynamicEditor = dynamic(() => import('../components/editor/editor'), {
  ssr: false,
})

export default function Create() {
  return (
    <main className={styles.create}>
      <div className={styles['create-content']}>
        <DynamicEditor></DynamicEditor>
      </div>
    </main>
  )
}
