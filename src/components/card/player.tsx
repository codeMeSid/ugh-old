import React from "react";
import Link from 'next/link';
import { UserDoc } from "../../../server/models/user"
import Button from "../button/main";
const PlayerImg = require("../../public/asset/player.jpg");

const PlayerCard = ({ player, currentUser }: { player: UserDoc, currentUser: any }) => {

    const profileUrl = JSON.stringify(player?.id) === JSON.stringify(currentUser.id) ? '/profile' : `/profile/${player?.ughId}`;
    const playerUghId = JSON.stringify(player?.id) === JSON.stringify(currentUser.id) ? `${player?.ughId} (YOU)` : player?.ughId

    return <div className="player">
        <div className="player__profile">
            <Link href={profileUrl}>
                <a>
                    <img src={player?.uploadUrl || PlayerImg} alt={player?.ughId} className="player__profile__image" />
                </a>
            </Link>
        </div>
        <Link href={profileUrl}>
            <a className="player__name">
                {playerUghId}
            </a>
        </Link>
        <Button text="CHAT" size="small" />
    </div>
}

export default PlayerCard;