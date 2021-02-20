import { CSSProperties, useEffect, useState } from "react";

const Timer = (
    {
        dateTime,
        canCountdown,
        onComplete = () => { },
        step = 1000,
        className = "",
        style = {},
        format = "D H M S",
        updateValue,
        placeholder
    }
        : {
            dateTime: Date | string,
            canCountdown: boolean,
            onComplete?: any,
            step?: number,
            className?: string,
            style?: CSSProperties,
            format?: string,
            updateValue?: string,
            placeholder?: string
        }) => {
    const [timer, setTimer] = useState('');
    let stopTimer = false;
    useEffect(() => {
        return () => clearTimeout();
    }, []);
    useEffect(() => {
        if (canCountdown && !stopTimer) setTimeout(() => {
            clearTimeout();
            getTimer()
        }, step);
    }, [timer])

    const getTimer = () => {
        const sdt = new Date(dateTime).getTime();
        const cdt = new Date().getTime();
        const msIn1Sec = 1000
        const msIn1Min = msIn1Sec * 60;
        const msIn1Hour = msIn1Min * 60;
        const msIn1Day = msIn1Hour * 24;
        const delta = sdt - cdt > 0 ? sdt - cdt : 0;
        const daysLeft = Math.floor(delta / msIn1Day);
        const hoursLeft = Math.floor((delta % (msIn1Day)) / (msIn1Hour));
        const minsLeft = Math.floor((delta % (msIn1Hour)) / (msIn1Min));
        const secondsLeft = Math.floor((delta % (msIn1Min)) / msIn1Sec);
        let diffTime = "";
        format?.split(" ").map(t => {
            switch (t) {
                case "D": diffTime += `${daysLeft} Days`;
                    break;
                case "H": diffTime += `${hoursLeft < 10 ? `0${hoursLeft}` : hoursLeft}h`;
                    break;
                case "M": diffTime += `${minsLeft < 10 ? `0${minsLeft}` : minsLeft}m`;
                    break;
                case "S": diffTime += `${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}s`;
                    break;
            }
            diffTime += " ";
        })
        if (daysLeft >= 0 && hoursLeft >= 0 && minsLeft >= 0 && secondsLeft >= 0) {
            if (daysLeft === 0 && hoursLeft === 0 && minsLeft === 0 && secondsLeft === 0) {
                if (onComplete) onComplete();
                if (updateValue) setTimer(updateValue)
                else setTimer(diffTime)
                stopTimer = true;
            }
            setTimer(diffTime);
        }
    }

    return <div className={className} style={style}>
        <div>{timer}</div>
        <div>{placeholder}</div>
    </div>
}




export default Timer;