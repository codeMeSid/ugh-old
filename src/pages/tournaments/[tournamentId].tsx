import Link from 'next/link'
import { TournamentDoc } from "../../../server/models/tournament";
import MainLayout from "../../components/layout/mainlayout";
import { serverRequest } from "../../hooks/server-request";
import { format } from 'date-fns';
import { useRequest } from "../../hooks/use-request";
import Button from "../../components/button/main";
import React, { useState } from "react";
import Router from 'next/router';
import DialogButton from '../../components/button/dialog';
import PlayerCard from '../../components/card/player';
import RichText from '../../components/rich-text';
import Timer from '../../components/timer';
import MessengerList from '../../components/messenger';
import { IoIosTrophy } from 'react-icons/io';
import IconDialogButton from '../../components/button/icon-dialog';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { prizeDistribution } from '../../../server/utils/prize-distribution';

const Logo = require("../../public/asset/logo-icon.png");


const TournamentDetail = ({ tournament, currentUser, errors }: { tournament: TournamentDoc, matches: any, currentUser: any, errors: any }) => {
    const [messages, setMessages] = useState(errors);
    const userHasJoined = tournament?.players?.filter(player => JSON.stringify(player?.id) === JSON.stringify(currentUser?.id)).length > 0;
    const chats = tournament && tournament.players ? tournament.players.map((user: any) => {
        if (currentUser?.ughId === user?.ughId) return;
        return ({ to: user?.ughId, channel: 'user', profile: user?.uploadUrl, title: user?.ughId })
    }).filter(chat => chat) : [];
    const JoinButton = () => {
        if (!currentUser) return <Link href="/login">
            <a>
                <Button text="Join" type="link" size="small" />
            </a>
        </Link>
        else if (tournament?.winners?.length > 0)
            return <DialogButton style={{ position: "fixed", minWidth: 400 }} size="medium" title="Winner List" fullButton>

                <table>
                    <tr>
                        <td>position</td>
                        <td>UghId</td>
                        <td>Prize</td>
                    </tr>
                    {tournament?.winners.map((winner) => {
                        return <tr key={Math.random()} style={{ fontSize: 20 }}>
                            <td>{winner.position}</td>
                            <td>{winner.ughId}</td>
                            <td>{winner.coins} coins</td>
                        </tr>
                    })}
                </table>

            </DialogButton>
        else if (tournament?.players?.length * tournament?.group?.participants === tournament?.playerCount && !userHasJoined)
            return <Button text="Slots Full" type="disabled" />
        else if (currentUser && tournament?.status === "upcoming" && !userHasJoined)
            return <DialogButton style={{ position: "fixed" }} size="medium" title="Join" fullButton onAction={doRequest}>
                <div style={{ fontSize: 20, marginBottom: 20 }}>You will be charged {tournament?.coins || 10} coins to join</div>
            </DialogButton>
        else if (currentUser && tournament?.status === "upcoming" && userHasJoined)
            return <Button text="Joined" type="facebook" size="small" />

        else if (currentUser && tournament?.status === "started" && userHasJoined) return <Link href={`/game/${tournament?.regId}`}>
            <a>
                <Button text="Play" type="link" size="small" />
            </a>
        </Link>
        else
            return <Button text="Join" type="disabled" size="small" />
    }

    const { doRequest } = useRequest({
        url: `/api/ugh/tournament/join/${tournament?.id}`,
        body: {},
        method: "get",
        onSuccess: Router.reload,
        onError: (errors) => setMessages(errors)
    });

    return <MainLayout messages={messages} isFullscreen>
        <div className="tournament">
            <div className="tournament__container">
                <div className="tournament__card">
                    <div className="tournament__card__head" style={{ backgroundImage: `url(${tournament?.game?.imageUrl})` }}>
                        <div className="tournament__card__head__title">{tournament?.name}</div>
                        <div className="tournament__card__head__time"><Timer canCountdown={!!tournament?.startDateTime} dateTime={tournament?.startDateTime} /></div>
                        {
                            tournament?.winners?.length > 0 && <div className="tournament__card__head__winner">
                                <IoIosTrophy className="tournament__card__head__winner__icon" />
                                <div className="tournament__card__head__winner__name">
                                    <div>{tournament.winners[0].ughId}</div>
                                    <div>{tournament.winners[0].coins} coins</div>
                                </div>
                            </div>
                        }
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
                                <div style={{ marginRight: 5, fontSize: 20, color: "white" }}> Tournament Prize {tournament?.winnerCoin} coins </div>
                                <IconDialogButton Icon={AiOutlineInfoCircle} style={{ position: "fixed", minWidth: 400 }} iconStyle={{ color: "red", fontSize: 20, cursor: "pointer", marginRight: 5, }}>
                                    <table>
                                        <tr>
                                            <td>
                                                position
                                            </td>
                                            <td>
                                                Prize
                                            </td>
                                        </tr>
                                        {prizeDistribution(tournament.winnerCoin, tournament.winnerCount).map((prize, index) => {
                                            return <tr key={Math.random()} style={{ fontSize: 20 }}>
                                                <td>{index + 1}</td>
                                                <td>{prize} coins</td>
                                            </tr>
                                        })}
                                    </table>

                                </IconDialogButton>
                                <div style={{ marginRight: 10 }}>
                                    {JoinButton()}
                                </div>
                                <div>
                                    {/* <Button text="View Rules"  size="medium" /> */}
                                    <DialogButton title="View Rules" type="github" size="medium" style={{ position: "fixed", width: "38rem", height: "50rem", overflowY: "scroll" }} fullButton>
                                        <h2>RULES OF THE GAME</h2>
                                        <div style={{ width: "30rem", margin: "0 auto" }}>
                                            <RichText content={tournament?.game?.rules} />
                                        </div>
                                    </DialogButton>
                                </div>
                            </div>
                        </div>
                        <div className="tournament__card__body__lower">
                            <div className="tournament__card__body__lower__left">
                                <div className="tournament__card__body__lower__left__item">
                                    <div style={{ marginBottom: 10 }}>Entry Coins</div>
                                    <div>{(tournament?.coins / tournament?.group?.participants) || 0} coins</div>
                                </div>
                                <div className="tournament__card__body__lower__left__item">
                                    <div style={{ marginBottom: 10 }}>Platform</div>
                                    <div>{tournament?.game?.console?.toUpperCase() || "NA"}</div>
                                </div>
                                <div className="tournament__card__body__lower__left__item">
                                    <div style={{ marginBottom: 10 }}>Participants</div>
                                    <div>{tournament?.players?.length * tournament?.group?.participants || 0}/{tournament?.playerCount || 0}</div>
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
                && tournament?.players?.filter(player => JSON.stringify(player?.id) === JSON.stringify(currentUser?.id))
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
        {(currentUser?.role === "admin" || userHasJoined) && <MessengerList
            from={currentUser?.role === "admin" ? "admin" : currentUser?.ughId}
            chats={[{ channel: "admin", title: "admin", to: "admin", profile: Logo }, { channel: "match", title: "match chat", to: tournament ? tournament.regId : "match" }, ...chats]} />}
    </MainLayout>
}

TournamentDetail.getInitialProps = async (ctx) => {
    const { tournamentId } = ctx.query
    const { data: tournament, errors: errorsA } = await serverRequest(ctx, {
        url: `/api/ugh/tournament/fetch/detail/${tournamentId}`,
        method: 'get',
        body: {}
    });

    const errors = []
    if (errorsA) errors.push(...errorsA);


    return {
        tournament,
        errors
    }
}

export default TournamentDetail;