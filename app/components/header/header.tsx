'use client'

import Link from 'next/link'
import styles from './header.module.scss'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Logo } from '../logo/logo'

export default function Header() {
  const pathname = usePathname()

  const { push } = useRouter()

  function navigateToEditor() {
    push('convert/visualize')
  }

  return (
    <header className={styles['header']}>
      <Logo withName={true} nameClassName={styles['header-logo-name']}></Logo>
      <nav>
        <ul>
          <li>
            <Link
              href="about"
              className={`bro-link ${
                pathname.startsWith('/about') ? 'active' : ''
              }`}
            >
              About
            </Link>
          </li>
          {/*           <li>
            <Link
              href="documentation"
              className={`bro-link ${
                pathname.startsWith('/documentation') ? 'active' : ''
              }`}
            >
              Docs
            </Link>
          </li> */}
          <li>
            <button
              type="button"
              className="bro-button bro-button-primary"
              onClick={navigateToEditor}
            >
              Start Creating
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}
