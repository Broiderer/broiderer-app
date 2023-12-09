import { PropsWithChildren, useEffect, useState } from 'react'
import styles from './editor-sidebar-section.module.scss'

type EditorSidebarSectionProps = {
  title: string
  initiallyOpened?: boolean
} & PropsWithChildren

export default function EditorSidebarSection({
  children,
  title,
  initiallyOpened,
}: EditorSidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(!!initiallyOpened)

  function toggleIsOpen() {
    setIsOpen((prevState) => !prevState)
  }

  return (
    <div className={styles['sidebar-section']}>
      <button type="button" onClick={toggleIsOpen}>
        {title}
      </button>
      {isOpen && (
        <div className={styles['sidebar-section-content']}>{children}</div>
      )}
    </div>
  )
}
