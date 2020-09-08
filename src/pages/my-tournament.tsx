import { useState, useEffect } from 'react'
import { serverRequest } from "../hooks/server-request"
import { TournamentDoc } from "../../server/models/tournament";
import MainLayout from "../components/layout/mainlayout";
import Tooltip from "../components/tooltip";
import Button from '../components/button/main';
import { AiOutlineMenu } from 'react-icons/ai';
import TournamentCard from '../components/card/tournament';

const Tournaments = ({ tournaments }) => {
    const [game, setGame] = useState('all');
    const [type, setType] = useState("upcoming");
    const [matches, setMatches] = useState([]);
    useEffect(() => {
        let newMatches = [];
        if (game === "all") {
            Object.keys(tournaments).forEach((key) => {
                const m = tournaments[key].items[type];
                if (m) newMatches.push(...m);
            });
        } else {
            if (tournaments[game]) {
                const m = tournaments[game]?.items[type];
                if (m) newMatches = m;
            }
        }
        setMatches(newMatches.filter(t => t));
    }, [game, type])
    return <MainLayout isFullscreen>
        <div className="match">
            <div className="match__head">
                <div className="match__head__container">
                    <div className="match__head__container__title">
                        our tournaments
                    </div>
                    <div className="match__head__container__subtitle">
                        This is where you can browse through our tournaments
                    </div>
                    <div className="match__head__container__list">
                        <div className="match__head__container__list__item">
                            <div className={`match__head__container__list__item__image ${game === 'all' ? "active" : ""} button`}>
                                <Button onPress={() => setGame('all')} text={<AiOutlineMenu />} />
                            </div>
                        </div>
                        {
                            Object.keys(tournaments).map((key) => {
                                const imageUrl = tournaments[key].game.thumbnailUrl;
                                const gameName = tournaments[key].game.name
                                return <Tooltip key={key} title={gameName}>
                                    <div onClick={() => setGame(gameName)} className="match__head__container__list__item">
                                        <img src={imageUrl} alt={gameName} className={`match__head__container__list__item__image ${game === gameName ? "active" : ""}`} />
                                    </div>
                                </Tooltip>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="match__footer">
                <div className="match__footer__title">
                    <div className="match__footer__title__main">Tournaments</div>
                    <ul className="match__footer__title__side">
                        {["upcoming", "started", "completed"].map(t => {
                            return <li onClick={() => setType(t)} className={`match__footer__title__side__item ${type === t ? "active" : ""}`} key={t}>{t}</li>
                        })}
                    </ul>
                </div>
                <div className="match__footer__list">
                    {matches.length >= 1 ? matches.map((match) => {
                        return <TournamentCard key={match.name} match={match} />
                    }) : <div style={{ textAlign: "center", fontSize: "2.5rem", color: "white", textTransform: "capitalize" }}>Currently,No tournaments available</div>}
                </div>
            </div>
        </div>
    </MainLayout>
}

Tournaments.getInitialProps = async (ctx) => {
    const { data }: { data: Array<TournamentDoc> } = await serverRequest(ctx, { url: "/api/ugh/tournament/fetch/all/my", body: {}, method: "get" });
    const tournaments = {}

    data?.map(t => {
        const gameName = t.game.name;
        const status = t.status;
        if (tournaments[gameName]) {
            const statusKey = tournaments[gameName].items[status];
            if (statusKey) tournaments[gameName].items[status].push(t)
            else tournaments[gameName].items[status] = [t]
        }
        else tournaments[gameName] = {
            items: { [status]: [t] },
            game: t.game
        }
    });
    return { tournaments }
}

export default Tournaments