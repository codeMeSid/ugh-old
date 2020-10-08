import { useState, useEffect } from 'react'
import { TournamentDoc } from "../../../server/models/tournament";
import Link from 'next/link';
import Router from 'next/router';
import Timer from '../timer';

const TournamentCard = ({ match }: { match: TournamentDoc }) => {
    return <Link href={`/tournaments/${match.regId}`}>
        <a className="match__footer__list__item">
            <img src={match.game.imageUrl} alt={match.game.name} className="match__footer__list__item__image" />
            <div className="match__footer__list__item__time">
                <div style={{ marginBottom: 2, fontSize: 18, textTransform: "uppercase" }}>{match.name}</div>
                <div><Timer canCountdown={!!match.startDateTime} dateTime={match.startDateTime} /></div>
            </div>
            <div className="match__footer__list__item__entry">
                <div style={{ marginBottom: 2 }}>Tournament Entry</div>
                <div>{match.coins} coins</div>
            </div>
        </a>
    </Link>
}

export default TournamentCard;