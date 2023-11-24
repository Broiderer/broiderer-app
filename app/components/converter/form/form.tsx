'use client';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ConvertOptions, ConvertOptionType } from '../model';
import styles from './form.module.scss';
import Options from './options/options';

const Form = (props: {
    onFileInput: Function, 
    from: "pes" | "svg", 
    to: "pes" | "svg", 
    convertOptions?: ConvertOptions | null, 
    onConvertOptionsChange?: Function,
    placeholder?: string
}) => {

    const onDrop = (acceptedFiles: File[]) => {
        props.onFileInput(acceptedFiles[0])
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: props.from === 'svg' ? {'image/svg+xml': ['.svg']} : {'accpliaction/pes': ['.pes']}
    });

    const optionChangeHandler = (value: string, type: ConvertOptionType) => {
        if (!props.onConvertOptionsChange) {
            return;
        }
        props.onConvertOptionsChange(value, type)
    }

    return <form className={styles.form}>
        {props.convertOptions && 
            <div className={styles.options}>
                <Options onOptionChange={optionChangeHandler}></Options>
            </div>
        }
        <div className={styles['upload-target']} {...getRootProps()}>
            <label>{props.placeholder || `Drop a .${props.from} file here to be converted to .${props.to} (max 100kB)`}</label>
            <input type="file" {...getInputProps()}></input>
        </div>
    </form>
}

export default Form;