"use client"

import Link from 'next/link';
import { usePathname } from "next/navigation";
import styles from './header.module.scss';

export default function Header() {
    const pathName = usePathname();

    return <div className={styles.header}>
        <div className={styles['header-left']}>
            <Link href="/">Broiderer</Link>
        </div>

        <div className={styles['header-right']}>
            <nav>
                <ul>
                    <Link href="/convert/svg2pes" className={"bro-link " + (pathName == "/convert/svg2pes" ? "active" : "")}>svg2pes</Link>
                    <Link href="/convert/pes2svg" className={"bro-link " + (pathName == "/convert/pes2svg" ? "active" : "")}>pes2svg</Link>
                    <Link href="/convert/visualize" className={"bro-link " + (pathName == "/convert/visualize" ? "active" : "")}>visualize</Link>
                </ul>
            </nav>
        </div>
    </div>
}