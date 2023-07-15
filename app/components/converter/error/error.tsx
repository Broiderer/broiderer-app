import { MouseEventHandler } from 'react';
import styles from './error.module.scss';

export default function ErrorMessage(props: {message: string, onBackToUpload: MouseEventHandler<HTMLAnchorElement>}) {
    return <div className={styles.error}>
        <a type="button" className="bro-link" href="#" onClick={props.onBackToUpload}>← Back to upload</a>
        <p>Error : <span className="bro-emphasis">{props.message}</span></p>
    </div>
}