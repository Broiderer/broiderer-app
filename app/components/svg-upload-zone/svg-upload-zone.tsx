
import Form from '../converter/form/form';
import styles from './svg-upload-zone.module.scss';

export default function SvgUploadZone({onUploadSvg}: {onUploadSvg: (svg: string) => void}) {

    const fileInputHandler = async (file: File) => {
        const svgText = await file.text();
        onUploadSvg(svgText)
    }

    return <div className={styles.svgUploadZone}>
        <div className={styles.form}>
            <Form onFileInput={fileInputHandler} from="svg" to="svg" placeholder="Upload a .svg file"></Form>
        </div>
    </div>
}