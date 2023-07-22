'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import styles from './converter.module.scss';
import Download from './download/download';
import ErrorMessage from './error/error';
import Form from './form/form';
import { ConvertOptions, ConvertOptionType } from './model';

/* const apiUrl = 'http://127.0.0.1:5000'; */
const apiUrl = 'https://guillaumemmm.pythonanywhere.com';

const svgConvertOptions: ConvertOptions = {
    [ConvertOptionType.distance]: '',
    [ConvertOptionType.tolerance]: '',
}

async function uploadFile(file: File, options: ConvertOptions | null) {
    const extensionFrom = file.name.split('.').pop();
    const extensionTo = extensionFrom === 'pes' ? 'svg' : 'pes';

    const formData = new FormData();
    formData.append('file', file);

    let inlineOptions = '';
    if (options) {
        inlineOptions += Object.keys(options).map((key, i) => {
            const opt = options[key as ConvertOptionType];
            return `${(i === 0 || !opt) ? '' : '&'}${opt ? `${key}=${opt}px` : ''}`
        }).join('');
    }

    return fetch(
        `${apiUrl}/convert?extensionFrom=${extensionFrom}&extensionTo=${extensionTo}&${inlineOptions}`, 
        {
            method: 'POST',
            body: formData
        }
    );
}

function parseErrorFromResponseText(responseText: string): string {
    const errorMessageMatch = responseText.match(/<p>(.*?)<\/p>/);
    if (errorMessageMatch && errorMessageMatch.length > 1) {
      return errorMessageMatch[1];
    }
    return 'Unknown error';
  }

export default function Converter(props: {from: "pes" | "svg", to: "pes" | "svg"}) {

    const [fileToUpload, setFileToUpload]: [File | null, Function] = useState(null);
    const [uploadedFileUrl, setUploadedFileUrl]: [string, Function] = useState('');
    const [loadingUpload, setLoadingUpload]: [boolean, Function] = useState(false);
    const [errorUploading, setErrorUploading]: [string, Function] = useState('');

    const [convertOptions, setConvertOptions]: [ConvertOptions | null, Dispatch<SetStateAction<ConvertOptions | null>>] = useState(
        props.from === 'svg' ? svgConvertOptions : null
    );

    const fileInputHandler = async (file: File) => {
        setFileToUpload(file);
        setLoadingUpload(true);
        setUploadedFileUrl('');
        try {
            const response = await uploadFile(file, convertOptions);
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(parseErrorFromResponseText(responseText));
            }
            const fileDownloadUrl = responseText;
            setUploadedFileUrl(fileDownloadUrl);
        } catch (error: unknown) {
            setErrorUploading((error as {message: string})?.message)
        } finally {
            setLoadingUpload(false);
        }
    }

    const backToUploadsHandler = () => {
        setFileToUpload(null);
        setErrorUploading('');
        setUploadedFileUrl('');
    }

    const optionChangeHandler = (value: string, type: ConvertOptionType) => {
        setConvertOptions(state => ({...state, [type]: value}));
    }

    return <div className={styles.converter}>
        <div className={styles.form}>
            {loadingUpload ? <div>Loading...</div> 
                : errorUploading ? <ErrorMessage message={errorUploading} onBackToUpload={backToUploadsHandler}></ErrorMessage>
                    : fileToUpload ? <Download onBackToUpload={backToUploadsHandler} downloadFileUrl={uploadedFileUrl} apiUrl={apiUrl}></Download> 
                        : <Form onFileInput={fileInputHandler} from={props.from} to={props.to} convertOptions={convertOptions} onConvertOptionsChange={optionChangeHandler}></Form>
            }
        </div>
    </div>
}