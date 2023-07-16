import { ChangeEventHandler, useEffect, useState } from "react";
import { ConvertOptionType } from "../../model";
import styles from "./options.module.scss";

const Options = (props: {onOptionChange: Function}) => {

    const [tolerance, setTolerance] = useState(1);
    const [distance, setDistance] = useState(5);

    const toleranceChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
        props.onOptionChange(event.target.value, ConvertOptionType.tolerance);
        setTolerance(Number(event.target.value))
    }

    const distanceChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
        props.onOptionChange(event.target.value, ConvertOptionType.distance);
        setDistance(Number(event.target.value))
    }

    useEffect(() => {
        props.onOptionChange(1, ConvertOptionType.tolerance);
        props.onOptionChange(5, ConvertOptionType.distance);
    }, []);

    return <div className={styles.options}>

        <div className={styles['option-form-group']}>
            <label htmlFor="tolerance">Tolerance</label>
            <p className="bro-muted">Max distance in pixels between start and end point to consider a path closed in your svg</p>
            <input type="number" placeholder="Pick a tolerance (px)" id="tolerance" min="0" value={tolerance} onChange={toleranceChangeHandler}></input>
        </div>

        <div className={styles['option-form-group']}>
            <label htmlFor="distance">Distance</label>
            <p className="bro-muted">Distance in pixels between two lines when the svg is filled</p>
            <input type="number" placeholder="Pick a distance (px)" id="distance" min="0" value={distance} onChange={distanceChangeHandler}></input>
        </div>
    </div>
}

export default Options;