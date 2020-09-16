import { UserDoc } from "../../../server/models/user";
import Button from "../../components/button/main";
import MainLayout from "../../components/layout/mainlayout";
import { serverRequest } from "../../hooks/server-request";
import Link from 'next/link';
import React from "react";
import { AiFillTrophy } from "react-icons/ai";
import { FaPiggyBank } from "react-icons/fa";
import { ImGift } from 'react-icons/im';
import { BsGear } from "react-icons/bs";
import { TournamentDoc } from "../../../server/models/tournament";
import TournamentTab from "../../components/tournament-tab";
const PlayerImg = require("../../public/asset/player.jpg");

const UserProfile = ({ user, matches }: { user: UserDoc, matches: any }) => {
    return <MainLayout isFullscreen>
        <div className="profile">
            <div className="profile__container">
                <div className="profile__head">
                    <div className="profile__head__left">
                        <div className="profile__head__left__container">
                            <img src={user?.uploadUrl || PlayerImg} alt={user?.ughId} className="profile__image" />
                        </div>
                    </div>
                    <div className="profile__head__right">
                        {user?.name}
                    </div>
                </div>
                <div className="profile__body">
                    <div className="profile__body__top">
                        <div className="profile__body__top__left">
                            <div className="profile__body__top__item">
                                <div className="profile__body__top__item__title">ugh id</div>
                                <div className="profile__body__top__item__value">{user?.ughId}</div>
                            </div>
                            <div className="profile__body__top__item">
                                <div className="profile__body__top__item__title">email</div>
                                <div className="profile__body__top__item__value">{user?.email}</div>
                            </div>
                            <div className="profile__body__top__item">
                                <div className="profile__body__top__item__title">coins</div>
                                <div className="profile__body__top__item__value">{user?.wallet?.coins}</div>
                            </div>
                        </div>
                        <div className="profile__body__top__right">
                        </div>
                    </div>
                    <div className="profile__body__bottom">
                        <div className="profile__body__bottom__left">
                            <div className="profile__body__bottom__left__title">bio</div>
                            <div className="profile__body__bottom__left__value">{user?.bio}</div>
                        </div>
                        <div className="profile__body__bottom__right">
                            <div className="profile__body__bottom__item">
                                <div className="profile__body__bottom__item__icon"><AiFillTrophy /></div>
                                <div className="profile__body__bottom__item__title">total wins</div>
                                <div className="profile__body__bottom__item__value">{user?.tournaments?.filter(match => match.didWin).length || 0}</div>
                            </div>
                            <div className="profile__body__bottom__item">
                                <div className="profile__body__bottom__item__icon"><FaPiggyBank /></div>
                                <div className="profile__body__bottom__item__title">total earning</div>
                                <div className="profile__body__bottom__item__value">{user?.tournaments?.filter(match => match.didWin)?.reduce((acc, match) => acc + match.coins, 0) || 0}</div>

                            </div>
                            <div className="profile__body__bottom__item">
                                <div className="profile__body__bottom__item__icon"><ImGift /></div>
                                <div className="profile__body__bottom__item__title">total tournament</div>
                                <div className="profile__body__bottom__item__value">{user?.tournaments?.length || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <TournamentTab matches={matches} />
    </MainLayout>
}

UserProfile.getInitialProps = async (ctx) => {
    const { data: tournaments }: { data: Array<TournamentDoc>, errors: Array<any> } = await serverRequest(ctx,
        { url: "/api/ugh/tournament/fetch/all/active", body: {}, method: "get" });
    console.log(ctx.query)
    const { data, errors } = await serverRequest(ctx, {
        url: `/api/ugh/user/fetch/profile/${ctx.query.ughId}`,
        method: "get",
        body: {}
    });
    const matches = {
        upcoming: [],
        started: [],
        completed: []
    }

    if (tournaments) {
        tournaments.forEach(tournament => {
            matches[tournament.status] = [...matches[tournament.status], tournament];
        })
    }

    return { user: data, matches }
}

export default UserProfile;