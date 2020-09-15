import { useState, useEffect } from 'react'
import { TournamentDoc } from "../../../server/models/tournament";
import Link from 'next/link';
import Router from 'next/router';

const TournamentCard = ({ match }: { match: TournamentDoc }) => {
    const [timer, setTimer] = useState('');
    let stopTimer = false;

    const getBalanceTimer = () => {
        const sdt = new Date(match.startDateTime).getTime();
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
        const diffTime = `${daysLeft} Days ${hoursLeft < 10 ? `0${hoursLeft}` : hoursLeft}h ${minsLeft < 10 ? `0${minsLeft}` : minsLeft}m ${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}s`

        if (daysLeft >= 0 && hoursLeft >= 0 && minsLeft >= 0 && secondsLeft >= 0) {
            if (daysLeft === 0 && hoursLeft === 0 && minsLeft === 0 && secondsLeft === 0) {
                // if (match.status === "upcoming") {
                //     alert("Reload the page for updates");
                //     Router.reload();
                // }
                stopTimer = true;
                return setTimer(match.status.toUpperCase())
            }
            setTimer(diffTime);
        }
    }

    useEffect(() => {
        if (!stopTimer) setTimeout(getBalanceTimer, 1000);
    }, [timer]);

    return <Link href={`/tournaments/${match.regId}`}>
        <a className="match__footer__list__item">
            <img src={match.game.imageUrl} alt={match.game.name} className="match__footer__list__item__image" />
            <div className="match__footer__list__item__time">
                <div style={{ marginBottom: 2, fontSize: 18, textTransform: "uppercase" }}>{match.name}</div>
                <div>{timer}</div>
            </div>
            <div className="match__footer__list__item__entry">
                <div style={{ marginBottom: 2 }}>Tournament Entry</div>
                <div>{match.coins} coins</div>
            </div>
        </a>
    </Link>
}

export default TournamentCard;