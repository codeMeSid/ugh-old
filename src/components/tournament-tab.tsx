import { useState } from "react"
import { TournamentDoc } from "../../server/models/tournament";
import TournamentCard from "./card/tournament";

const TournamentTab = ({ matches }: { matches: { upcoming: Array<TournamentDoc>, started: Array<TournamentDoc>, completed: Array<TournamentDoc> } }) => {
    const [type, setType] = useState("upcoming");

    return <div className="match__footer">
        <div className="match__footer__title">
            <div className="match__footer__title__main">Tournaments</div>
            <ul className="match__footer__title__side">
                {["upcoming", "started", "completed"].map(t => {
                    return <li onClick={() => setType(t)} className={`match__footer__title__side__item ${type === t ? "active" : ""}`} key={t}>{t}</li>
                })}
            </ul>
        </div>
        <div className="match__footer__list">
            {matches[type].length >= 1 ? matches[type].map((match) => {
                return <TournamentCard key={Math.random()} match={match} />
            }) : <div style={{ textAlign: "center", fontSize: "2.5rem", color: "white", textTransform: "capitalize" }}>Currently,No tournaments available</div>}
        </div>
    </div>
}

export default TournamentTab;