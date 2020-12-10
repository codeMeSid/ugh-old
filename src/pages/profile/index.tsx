import { UserDoc } from "../../../server/models/user";
import Button from "../../components/button/main";
import MainLayout from "../../components/layout/mainlayout";
import { serverRequest } from "../../hooks/server-request";
import Link from "next/link";
import React, { useEffect } from "react";
import { AiFillTrophy } from "react-icons/ai";
import { FaPiggyBank } from "react-icons/fa";
import { ImGift } from "react-icons/im";
import { BsGear } from "react-icons/bs";
import { TournamentDoc } from "../../../server/models/tournament";
import TournamentTab from "../../components/tournament-tab";
import Tooltip from "../../components/tooltip";
const PlayerImg = require("../../public/asset/user.svg");

const UserProfile = ({
  user,
  matches,
  errors,
  isNewAuth,
  isSocialAuth,
}: {
  user: UserDoc;
  matches: any;
  errors: any;
  isNewAuth: boolean;
  isSocialAuth: boolean;
}) => {
  useEffect(() => {
    if (isNewAuth)
      alert(
        "Welcome to UGH! Complete your profile, to get bonus prize of 250 UGH Coins."
      );
    else if (isSocialAuth)
      alert(
        "Congratulations!!! You've been awarded 250 UGH coins. Let's get cracking."
      );
  }, []);
  return (
    <MainLayout messages={errors} isFullscreen>
      <div className="profile">
        <div className="profile__container">
          <div className="profile__head">
            <div className="profile__head__left">
              <div className="profile__head__left__container">
                <img
                  src={user?.uploadUrl || PlayerImg}
                  alt={user?.ughId}
                  className="profile__image"
                />
              </div>
            </div>
            <div className="profile__head__right">{user?.name}</div>
          </div>
          <div className="profile__body">
            <div className="profile__body__top">
              <div className="profile__body__top__left">
                <div className="profile__body__top__item">
                  <div className="profile__body__top__item__title">ugh id</div>
                  <div className="profile__body__top__item__value">
                    {user?.ughId}
                  </div>
                </div>
                <div className="profile__body__top__item">
                  <div className="profile__body__top__item__title">email</div>
                  <div className="profile__body__top__item__value">
                    {user?.email}
                  </div>
                </div>
                <div className="profile__body__top__item">
                  <div className="profile__body__top__item__title">
                    <Link href="/profile/passbook">
                      <a>
                        <Tooltip title="See Passbook">coins</Tooltip>
                      </a>
                    </Link>
                  </div>
                  <div className="profile__body__top__item__value">
                    <Link href="/profile/passbook">
                      <a>
                        <Tooltip title="See Passbook">
                          {user?.wallet?.coins}
                        </Tooltip>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="profile__body__top__right">
                <Link href="/profile/edit">
                  <a>
                    <Button text="EDIT PROFILE" />
                  </a>
                </Link>
              </div>
            </div>
            <div className="profile__body__top" style={{ marginTop: 10 }}>
              <div className="profile__body__top__left">
                {user?.gamerProfile?.psnId && (
                  <div className="profile__body__top__item">
                    <div className="profile__body__top__item__title">
                      psn id
                    </div>
                    <div className="profile__body__top__item__value">
                      {user?.gamerProfile?.psnId}
                    </div>
                  </div>
                )}
                {user?.gamerProfile?.gamerTag && (
                  <div className="profile__body__top__item">
                    <div className="profile__body__top__item__title">
                      gamer tag
                    </div>
                    <div className="profile__body__top__item__value">
                      {user?.gamerProfile?.gamerTag}
                    </div>
                  </div>
                )}
                {user?.gamerProfile?.steamId && (
                  <div className="profile__body__top__item">
                    <div className="profile__body__top__item__title">
                      steam id
                    </div>
                    <div className="profile__body__top__item__value">
                      {user?.gamerProfile?.steamId}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="profile__body__bottom">
              <div className="profile__body__bottom__left">
                <div className="profile__body__bottom__left__title">bio</div>
                <div className="profile__body__bottom__left__value">
                  {user?.bio}
                </div>
              </div>
              <div className="profile__body__bottom__right">
                <div className="profile__body__bottom__item">
                  <div className="profile__body__bottom__item__icon">
                    <AiFillTrophy />
                  </div>
                  <div className="profile__body__bottom__item__title">
                    total wins
                  </div>
                  <div className="profile__body__bottom__item__value">
                    {user?.tournaments?.filter((match) => match.didWin)
                      .length || 0}
                  </div>
                </div>
                <div className="profile__body__bottom__item">
                  <div className="profile__body__bottom__item__icon">
                    <FaPiggyBank />
                  </div>
                  <div className="profile__body__bottom__item__title">
                    total earning
                  </div>
                  <div className="profile__body__bottom__item__value">
                    {user?.tournaments
                      ?.filter((match) => match.didWin)
                      ?.reduce((acc, match) => acc + match.coins, 0) || 0}
                  </div>
                </div>
                <div className="profile__body__bottom__item">
                  <div className="profile__body__bottom__item__icon">
                    <ImGift />
                  </div>
                  <div className="profile__body__bottom__item__title">
                    total tournament
                  </div>
                  <div className="profile__body__bottom__item__value">
                    {user?.tournaments?.length || 0}
                  </div>
                </div>
                <div className="profile__body__bottom__item">
                  <Link href="/settings">
                    <a>
                      <div className="profile__body__bottom__item__icon">
                        <BsGear />
                      </div>
                      <div className="profile__body__bottom__item__title">
                        user settings
                      </div>
                      <div
                        className="profile__body__bottom__item__value"
                        style={{ opacity: 0 }}
                      >
                        123
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TournamentTab matches={matches} />
    </MainLayout>
  );
};

UserProfile.getInitialProps = async (ctx) => {
  const {
    data: tournaments,
    errors: errorsA,
  }: {
    data: Array<TournamentDoc>;
    errors: Array<any>;
  } = await serverRequest(ctx, {
    url: "/api/ugh/tournament/fetch/all/active",
    body: {},
    method: "get",
  });
  const { data: user, errors: errorsB } = await serverRequest(ctx, {
    url: "/api/ugh/user/fetch/profile",
    method: "get",
    body: {},
  });
  const matches = {
    upcoming: [],
    started: [],
    completed: [],
  };
  if (tournaments)
    tournaments.forEach((tournament) => {
      matches[tournament.status] = [...matches[tournament.status], tournament];
    });
  const errors = [];
  if (errorsA) errors.push(...errorsA);
  if (errorsB) errors.push(...errorsB);
  const isNewAuth = ctx.query.newauth === "true";
  const isSocialAuth = ctx.query.socialauth === "true";
  return { user, matches, errors, isNewAuth, isSocialAuth };
};

export default UserProfile;
