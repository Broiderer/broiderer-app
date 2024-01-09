import Image from 'next/image'
import Link from 'next/link'
import styles from './logo.module.scss'
import logo from '../../assets/logo.jpg'

export function Logo({
  withName,
  nameClassName,
}: {
  withName?: boolean
  nameClassName?: string
}) {
  return (
    <Link className={styles['logo']} href="/">
      <Image src={logo} alt="" className={styles['logo-image']}></Image>
      {withName && (
        <div className={`${styles['logo-name']} ${nameClassName ?? ''}`}>
          Broiderer
        </div>
      )}
    </Link>
  )
}
