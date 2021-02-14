import { UserDoc } from "../../../server/models/user";
import Button from "../../components/button/main";
import MainLayout from "../../components/layout/mainlayout";
import { serverRequest } from "../../hooks/server-request";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiFillTrophy } from "react-icons/ai";
import { FaPiggyBank } from "react-icons/fa";
import { ImGift } from "react-icons/im";
import { BsGear } from "react-icons/bs";
import { TournamentDoc } from "../../../server/models/tournament";
import TournamentTab from "../../components/tournament-tab";
import Tooltip from "../../components/tooltip";
import TextDialogButton from "../../components/button/text-dialog";
import { useRequest } from "../../hooks/use-request";
import Router from "next/router";
import Input from "../../components/input/input";
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
  const [messages, setMessages] = useState(errors);
  const [newUghId, setNewUghId] = useState("");
  const [confUghId, setConfUghId] = useState("");
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
    <MainLayout messages={messages}>
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
                    <TextDialogButton
                      text={
                        <Tooltip title="Click to Update">{user?.ughId}</Tooltip>
                      }
                      style={{ position: "fixed", width: 400 }}
                      buttonText="Update"
                      onAction={(onSuccess, onError) => {
                        if (newUghId.length < 3) {
                          setMessages([
                            { message: "UghId should've minimum 3 chars." },
                          ]);
                          onError(null);
                          return;
                        }
                        if (
                          new RegExp('[!@#$%^&*(),.?":{}|<>]').test(newUghId)
                        ) {
                          setMessages([
                            { message: "UGH ID contains invalid chars." },
                          ]);
                          onError(null);
                          return;
                        }
                        if (newUghId !== confUghId || newUghId === "") {
                          setMessages([{ message: "UghId's do not match" }]);
                          onError(null);
                          return;
                        }
                        const { doRequest } = useRequest({
                          url: "/api/ugh/user/update/ughId",
                          body: { newUghId },
                          method: "put",
                          onError: (err) => {
                            setMessages(err);
                          },
                          onSuccess: Router.reload,
                        });
                        doRequest(onSuccess, onError);
                      }}
                    >
                      <div>
                        <Input
                          placeholder="New UghId"
                          value={newUghId}
                          onChange={(n, v) => {
                            if (`${v}`.split(" ").length > 1)
                              return setMessages([
                                {
                                  message:
                                    "UghId cannot container white space characters",
                                },
                              ]);
                            return setNewUghId(v);
                          }}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Confirm UghId"
                          value={confUghId}
                          onChange={(n, v) => setConfUghId(v)}
                        />
                      </div>
                      <div
                        style={{ color: "red", fontSize: 16, margin: "10px 0" }}
                      >
                        ***NOTE: You will be charged 50 UGH coins to update your
                        UghId. Also make sure your wallet has sufficient
                        balance, else it will be deducted from your earnings.
                      </div>
                    </TextDialogButton>
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
                <div
                  className="profile__body__bottom__left__value"
                  style={{ wordWrap: "break-word", wordBreak: "keep-all" }}
                >
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
                    <Link href={`/profile/tournament/${user?.ughId}`}>
                      <a>
                        <Tooltip title="tournament history">
                          total tournament
                        </Tooltip>
                      </a>
                    </Link>
                  </div>
                  <div className="profile__body__bottom__item__value">
                    <Link href={`/profile/tournament/${user?.ughId}`}>
                      <a>{user?.tournaments?.length || 0}</a>
                    </Link>
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
