import { MouseEventHandler } from "react";
import styles from './download.module.scss';


export default function Download(props: {onBackToUpload: MouseEventHandler<HTMLAnchorElement>}) {
    return <div className={styles.download}>
        <a type="button" className="bro-link" href="#" onClick={props.onBackToUpload}>← Back to upload</a>
        <p>The file was <span className="bro-emphasis">successfully uploaded and converted.</span> Click the button below to download the converted file.</p>
        <button type="button" className="bro-button">Download!</button>
    </div>
}