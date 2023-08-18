'use client';
import { ChangeEvent } from 'react';
import { SvgTransformOptions } from '../svg-editor';
import styles from './svg-editor-form.module.scss';

export default function SvgEditorForm({ svgTransformOptions, setSvgTransformOptions }: { svgTransformOptions: SvgTransformOptions, setSvgTransformOptions: React.Dispatch<React.SetStateAction<SvgTransformOptions>> }) {
    
    const rangeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setSvgTransformOptions(prevOptions => (
            {...prevOptions, path: {...prevOptions.path, step: Number(event.target.value)}}
        ))
    }

    const colorChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setSvgTransformOptions(prevOptions => (
            {...prevOptions, path: {...prevOptions.path, stroke: event.target.value}}
        ))
    }

    return <form className={styles['svg-editor-form']}>
        <h2>PATHS</h2>
        <div>
            <label htmlFor="path-step">Path step length (in pixels)</label>
            <input id="path-step" type="number" min={1} max={20} onChange={rangeChangeHandler} defaultValue={svgTransformOptions.path.step}></input>
        </div>

        <div>
            <label htmlFor="path-step">Path color</label>
            <input id="path-step" type='color' onChange={colorChangeHandler} defaultValue={svgTransformOptions.path.stroke}></input>
        </div>
    </form>
}