import React from "react";
import Link from "next/link";
import { UserDoc } from "../../../server/models/user";
import Button from "../button/main";
const PlayerImg = require("../../public/asset/logo-icon.png");

const PlayerCard = ({
  player,
  currentUser,
}: {
  player: UserDoc;
  currentUser: any;
}) => {
  const profileUrl =
    JSON.stringify(player?.id) === JSON.stringify(currentUser.id)
      ? "/profile"
      : `/profile/${player?.ughId}`;
  const playerUghId =
    JSON.stringify(player?.id) === JSON.stringify(currentUser.id)
      ? `${player?.ughId} (YOU)`
      : player?.ughId;

  return (
    <div className="player">
      <div className="player__profile">
        <Link href={profileUrl}>
          <a>
            <div
              style={{
                backgroundImage: `url(${player?.uploadUrl || PlayerImg})`,
              }}
              className="player__profile__image"
            />
          </a>
        </Link>
      </div>
      <div className="player__name">{playerUghId}</div>
      <Link href={profileUrl}>
        <a className="player__name">
          <Button text="View Profile" type="link" />
        </a>
      </Link>
    </div>
  );
};

export default PlayerCard;
