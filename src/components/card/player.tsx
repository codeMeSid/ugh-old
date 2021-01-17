import React from "react";
import Link from "next/link";
import { UserDoc } from "../../../server/models/user";
import Button from "../button/main";
import ImageDialogButton from "../button/image-dialog";
const PlayerImg = require("../../public/asset/logo_icon.webp");
const TeamImg = require("../../public/asset/team_icon.webp");

const PlayerCard = ({
  player,
  currentUser,
  teamMates,
}: {
  player: UserDoc;
  currentUser: any;
  teamMates?: Array<any>;
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
      <div className="player__team">
        {teamMates.length > 0 && (
          <ImageDialogButton
            ImageLink={TeamImg}
            imageStyle={{
              borderRadius: "50%",
              backgroundColor: "red",
              width: 25,
              height: 25,
            }}
            style={{
              minWidth: 360,
              position: "fixed",
              top: "40%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              color: "black",
            }}
          >
            <div style={{ textAlign: "center", fontSize: 28 }}>Team Info</div>
            <table>
              <tr>
                <td>InGame ID</td>
                <td>Email</td>
              </tr>
              {teamMates?.map((t: any) => {
                return (
                  <tr key={Math.random()}>
                    <td>{t.name}</td>
                    <td>{t.email || "-"}</td>
                  </tr>
                );
              })}
            </table>
          </ImageDialogButton>
        )}
      </div>
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
