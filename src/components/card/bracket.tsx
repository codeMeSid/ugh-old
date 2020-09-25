import Link from 'next/link';
import { BracketDoc } from "../../../server/models/bracket";

const BracketCard = ({ bracket, currentUser }: { bracket: BracketDoc, currentUser: any }) => {
    const isPlayerA = currentUser?.id === bracket.teamA.user?.id;
    const isPlayerB = currentUser?.id === bracket.teamB.user?.id;
    return isPlayerA || isPlayerB
        ? (<Link href={`/tournaments/game/bracket/${bracket?.regId}`}>
            <a className="bracket">
                <div className="bracket__round">
                    round {bracket?.round}
                </div>
                <div className="bracket__container">
                    {bracket?.winner && <div className="bracket__plag">completed</div>}
                    <div>
                        <div className="bracket__player" style={{ backgroundImage: `url(${bracket?.teamA?.user?.uploadUrl})` }} />
                        <div className="bracket__player__name">{bracket?.teamA?.user?.ughId}</div>
                    </div>

                    <div className="bracket__vs">vs</div>
                    <div>
                        <div className="bracket__player" style={{ backgroundImage: `url(${bracket?.teamB?.user?.uploadUrl})` }} />
                        <div className="bracket__player__name">{bracket?.teamB?.user?.ughId}</div>
                    </div>
                </div>
                <div className="bracket__winner">
                    winner: {bracket?.winner || "tbd"}
                </div>
            </a>
        </Link>)
        : (<div className="bracket">
            <div className="bracket__round">
                round {bracket?.round}
            </div>
            <div className="bracket__container">
                {bracket?.winner && <div className="bracket__plag">completed</div>}
                <div>
                    <div className="bracket__player" style={{ backgroundImage: `url(${bracket?.teamA?.user?.uploadUrl})` }} />
                    <div className="bracket__player__name">{bracket?.teamA?.user?.ughId}</div>
                </div>

                <div className="bracket__vs">vs</div>
                <div>
                    <div className="bracket__player" style={{ backgroundImage: `url(${bracket?.teamB?.user?.uploadUrl})` }} />
                    <div className="bracket__player__name">{bracket?.teamB?.user?.ughId}</div>
                </div>
            </div>
            <div className="bracket__winner">
                winner: {bracket?.winner || "tbd"}
            </div>
        </div>)
}

export default BracketCard;