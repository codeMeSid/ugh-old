import Link from 'next/link'
import { TournamentDoc } from "../../../server/models/tournament";
import ProgressButton from "../../components/button/progress";
import MainLayout from "../../components/layout/mainlayout";
import TournamentTab from "../../components/tournament-tab";
import { serverRequest } from "../../hooks/server-request";
import { format } from 'date-fns';
import { useRequest } from "../../hooks/use-request";
import Button from "../../components/button/main";
import React, { useEffect, useState } from "react";
import Router from 'next/router';
import DialogButton from '../../components/button/dialog';
import PlayerCard from '../../components/card/player';

const TournamentDetail = ({ tournament, matches, currentUser }: { tournament: TournamentDoc, matches: any, currentUser: any }) => {
    const [timer, setTimer] = useState('');
    let stopTimer = false;

    const getBalanceTimer = () => {
        const sdt = new Date(tournament?.startDateTime).getTime();
        const cdt = new Date().getTime();
        const msIn1Sec = 1000
        const msIn1Min = msIn1Sec * 60;
        const msIn1Hour = msIn1Min * 60;
        const msIn1Day = msIn1Hour * 24;
        const delta = sdt - cdt > 0 ? sdt - cdt : 0;
        const daysLeft = Math.floor(delta / msIn1Day);
        const hoursLeft = Math.floor((delta % (msIn1Day)) / (msIn1Hour));
        const minsLeft = Math.floor((delta % (msIn1Hour)) / (msIn1Min));
        const secondsLeft = Math.floor((delta % (msIn1Min)) / msIn1Sec);
        const diffTime = `${daysLeft} Days ${hoursLeft < 10 ? `0${hoursLeft}` : hoursLeft}h ${minsLeft < 10 ? `0${minsLeft}` : minsLeft}m ${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}s`
        if (daysLeft >= 0 && hoursLeft >= 0 && minsLeft >= 0 && secondsLeft >= 0) {
            if (daysLeft === 0 && hoursLeft === 0 && minsLeft === 0 && secondsLeft === 0) {
                // if (tournament?.status === "upcoming") {
                //     alert("Reload the page for updates");
                //     Router.reload();
                // }
                stopTimer = true;
                return setTimer(tournament?.status?.toUpperCase())
            }
            setTimer(diffTime);
        }
    }

    const JoinButton = () => {
        if (!currentUser) return <Link href="/login">
            <a>
                <Button text="Join" type="link" size="small" />
            </a>
        </Link>
        const userHasJoined = tournament?.players
            .filter(player => JSON.stringify(player?.id) === JSON.stringify(currentUser?.id))
            .length > 0;
        if (currentUser && tournament?.status === "upcoming" && !userHasJoined)
            return <ProgressButton text="Join" type="link" size="small" onPress={async (_, next) => {
                await doRequest();
                next();
            }} />
        if (currentUser && tournament?.status === "upcoming" && userHasJoined)
            return <Button text="Joined" type="facebook" size="small" />
        if (currentUser && tournament?.status === "started" && userHasJoined) return <Link href={`/tournaments/game/${tournament?.regId}`}>
            <a>
                <Button text="Play" type="link" size="small" />
            </a>
        </Link>

        return <Button text="Join" type="disabled" size="small" />
    }

    useEffect(() => {
        if (!stopTimer) setTimeout(getBalanceTimer, 1000);
    }, [timer]);

    const { doRequest } = useRequest({
        url: `/api/ugh/tournament/join/${tournament?.id}`,
        body: {},
        method: "get",
        onSuccess: Router.reload
    });

    return <MainLayout isFullscreen>
        <div className="tournament">
            <div className="tournament__container">
                <div className="tournament__card">
                    <div className="tournament__card__head" style={{ backgroundImage: `url(${tournament?.game?.imageUrl})` }}>
                        <div className="tournament__card__head__title">{tournament?.name}</div>
                        <div className="tournament__card__head__time">{timer}</div>
                    </div>
                    <div className="tournament__card__body">
                        <div className="tournament__card__body__upper">
                            <div className="tournament__card__body__upper__left">
                                <img
                                    src={tournament?.game?.thumbnailUrl}
                                    alt={tournament?.game?.name}
                                    className="tournament__card__body__upper__left__image" />
                            </div>
                            <div className="tournament__card__body__upper__right">
                                <div style={{ marginRight: 10, fontSize: 20, color: "white" }}> Tournament Prize {tournament?.winnerCoin} coins</div>
                                <div style={{ marginRight: 10 }}>
                                    {JoinButton()}
                                </div>
                                <div>
                                    {/* <Button text="View Rules"  size="medium" /> */}
                                    <DialogButton title="View Rules" type="github" size="medium" style={{ position: "fixed" }} fullButton>
                                        <h2>RULES OF THE GAME</h2>
                                    </DialogButton>
                                </div>
                            </div>
                        </div>
                        <div className="tournament__card__body__lower">
                            <div className="tournament__card__body__lower__left">
                                <div className="tournament__card__body__lower__left__item">
                                    <div style={{ marginBottom: 10 }}>Entry Coins</div>
                                    <div>{tournament?.coins || 0} coins</div>
                                </div>
                                <div className="tournament__card__body__lower__left__item">
                                    <div style={{ marginBottom: 10 }}>Platform</div>
                                    <div>{tournament?.game?.console?.toUpperCase() || "NA"}</div>
                                </div>
                                <div className="tournament__card__body__lower__left__item">
                                    <div style={{ marginBottom: 10 }}>Participants</div>
                                    <div>{tournament?.players?.length || 0}/{tournament?.playerCount || 0}</div>
                                </div>
                                {tournament?.group
                                    && <div className="tournament__card__body__lower__left__item">
                                        <div style={{ marginBottom: 10 }}>Teams</div>
                                        <div>{tournament?.group?.name.toUpperCase()} - {tournament?.group?.participants} players</div>
                                    </div>}
                                <div className="tournament__card__body__lower__left__item">
                                    <div style={{ marginBottom: 10 }}>Starts On</div>
                                    <div>{format(new Date(tournament?.startDateTime || Date.now()), "dd/MM/yyyy hh:mm a")}</div>
                                </div>
                                <div className="tournament__card__body__lower__left__item">
                                    <div style={{ marginBottom: 10 }}>Ends On</div>
                                    <div>{format(new Date(tournament?.endDateTime || Date.now()), "dd/MM/yyyy hh:mm a")}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {currentUser
                && tournament?.players
                    .filter(player => JSON.stringify(player?.id) === JSON.stringify(currentUser?.id))
                    .length > 0
                &&
                <div className="tournament__container tournament__container--footer">
                    <div className="tournament__container--footer__title">Live Players</div>
                    <div className="tournament__container__list">
                        {tournament?.players?.map(player => <PlayerCard key={Math.random()} currentUser={currentUser} player={player} />)}
                    </div>
                </div>
            }
        </div>
        <TournamentTab matches={matches} />
    </MainLayout>
}

TournamentDetail.getInitialProps = async (ctx) => {
    const { tournamentId } = ctx.query
    const { data: tournament } = await serverRequest(ctx, {
        url: `/api/ugh/tournament/fetch/detail/${tournamentId}`,
        method: 'get',
        body: {}
    });
    const { data, errors }: { data: Array<TournamentDoc>, errors: Array<any> } = await serverRequest(ctx, { url: "/api/ugh/tournament/fetch/all/active", body: {}, method: "get" });
    const matches = {
        upcoming: [],
        started: [],
        completed: []
    }
    if (!data) {
        return {
            matches, errors
        }
    }
    data.forEach(tournament => {
        matches[tournament.status] = [...matches[tournament.status], tournament];
    });
    return { matches, tournament }
}

export default TournamentDetail;