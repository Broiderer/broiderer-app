import { MouseEventHandler } from "react";
import styles from './download.module.scss';


export default function Download(props: {
    onBackToUpload: MouseEventHandler<HTMLAnchorElement>, 
    downloadFileUrl: string,
    apiUrl: string
}) {

    const handleDownloadClick = () => {
        const downloadUrl = `${props.apiUrl}${props.downloadFileUrl}`;
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.setAttribute("download", "file");
        a.setAttribute("target", "_blank");
        document.body.appendChild(a);
        a.click();
        a.parentElement?.removeChild(a);
    }

    return <div className={styles.download}>
        <a type="button" className="bro-link" href="#" onClick={props.onBackToUpload}>← Back to upload</a>
        <p>The file was <span className="bro-emphasis">successfully uploaded and converted.</span> Click the button below to download the converted file.</p>
        <button type="button" className="bro-button" onClick={handleDownloadClick}>Download!</button>
    </div>
}