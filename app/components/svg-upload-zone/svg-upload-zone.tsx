
import Form from '../converter/form/form';
import styles from './svg-upload-zone.module.scss';

export default function SvgUploadZone({onUploadSvg}: {onUploadSvg: (svg: File) => void}) {

    const fileInputHandler = async (file: File) => {
        onUploadSvg(file)
    }

    return <div className={styles.svgUploadZone}>
        <div className={styles.form}>
            <Form onFileInput={fileInputHandler} from="svg" to="svg" placeholder="Upload a .svg file"></Form>
        </div>
    </div>
}