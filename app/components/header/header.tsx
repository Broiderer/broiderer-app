import styles from './header.module.scss';

export default function Header() {

    return <div className={styles.header}>
        <div className={styles['header-left']}>
            Broiderer
        </div>
    </div>
}