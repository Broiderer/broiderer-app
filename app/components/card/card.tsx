import Link from 'next/link';
import styles from './card.module.scss';

export default function Card(props: {children: React.ReactNode, title: string, href: string}) {

    return <Link  href={props.href} className={styles.card}>
        <h2>{props.title}</h2>
        <p>
            {props.children}
        </p>
    </Link>
}