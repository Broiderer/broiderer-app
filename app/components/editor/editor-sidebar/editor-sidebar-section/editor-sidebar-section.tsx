import { PropsWithChildren, useEffect, useState } from 'react'
import styles from './editor-sidebar-section.module.scss'

type EditorSidebarSectionProps = {
  title: string
  iconClassName?: string
  initiallyOpened?: boolean
  className?: string
} & PropsWithChildren

export default function EditorSidebarSection({
  children,
  title,
  iconClassName,
  initiallyOpened,
  className,
}: EditorSidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(!!initiallyOpened)

  function toggleIsOpen() {
    setIsOpen((prevState) => !prevState)
  }

  return (
    <div className={styles['sidebar-section']}>
      <button
        className={`bro-button ${styles['sidebar-section-button']} ${
          className ? className : ''
        }`}
        type="button"
        onClick={toggleIsOpen}
        aria-expanded={isOpen}
      >
        <div className={styles['sidebar-section-button-title']}>
          {iconClassName && <i className={`bro-icon ${iconClassName}`} />}
          {title}
        </div>
        <div>
          <i
            className={`bro-icon bro-icon-chevron-${isOpen ? 'down' : 'right'}`}
          />
        </div>
      </button>
      {isOpen && (
        <div className={styles['sidebar-section-content']}>{children}</div>
      )}
    </div>
  )
}
