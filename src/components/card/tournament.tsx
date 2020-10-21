import React, { useState, useEffect } from 'react'
import { TournamentDoc } from "../../../server/models/tournament";
import Link from 'next/link';
import Timer from '../timer';
import { IoIosTrophy } from 'react-icons/io';

const TournamentCard = ({ match }: { match: TournamentDoc }) => {
    return <Link href={`/tournaments/${match.regId}`}>
        <a className="match__footer__list__item">
            {match.winners.length > 0 && <>
                <IoIosTrophy className="match__footer__list__item__winner" />
                {/* <div className="match__footer__list__item__winner__name">
                    <div>{match.winners[0].ughId}</div>
                    <div>{match.winners[0].coins} coins</div>
                </div> */}

            </>}
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