import React from "react";
import Link from 'next/link';
import { UserDoc } from "../../../server/models/user"
import Button from "../button/main";
const PlayerImg = require("../../public/asset/player.jpg");

const PlayerCard = ({ player }: { player: UserDoc }) => {
    return <div className="player">
        <div className="player__profile">
            <Link href={`/profile/${player?.id}`}>
                <a>
                    <img src={player?.uploadUrl || PlayerImg} alt={player?.ughId} className="player__profile__image" />
                </a>
            </Link>
        </div>
        <Link href={`/profile/${player?.id}`}>
            <a className="player__name">
                {player?.ughId}
            </a>
        </Link>
        <Button text="CHAT" size="small" />
    </div>
}

export default PlayerCard;