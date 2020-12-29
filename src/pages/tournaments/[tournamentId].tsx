import Link from "next/link";
import { TournamentDoc } from "../../../server/models/tournament";
import MainLayout from "../../components/layout/mainlayout";
import { serverRequest } from "../../hooks/server-request";
import { format } from "date-fns";
import { useRequest } from "../../hooks/use-request";
import Button from "../../components/button/main";
import React, { useState } from "react";
import Router from "next/router";
import DialogButton from "../../components/button/dialog";
import PlayerCard from "../../components/card/player";
import RichText from "../../components/rich-text";
import Timer from "../../components/timer";
import MessengerList from "../../components/messenger";
import { IoIosTrophy } from "react-icons/io";
import IconDialogButton from "../../components/button/icon-dialog";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { prizeDistribution } from "../../../server/utils/prize-distribution";
import { numberPostion } from "../../public/number-postion";

const Logo = require("../../public/asset/logo_icon.webp");

const TournamentDetail = ({
  tournament,
  currentUser,
  errors,
}: {
  tournament: TournamentDoc;
  matches: any;
  currentUser: any;
  errors: any;
}) => {
  const [messages, setMessages] = useState(errors);
  const userHasJoined =
    tournament?.players?.filter(
      (player) => JSON.stringify(player?.id) === JSON.stringify(currentUser?.id)
    )?.length > 0;
  const chats =
    tournament && tournament.players
      ? tournament.players
          .map((user: any) => {
            if (currentUser?.ughId === user?.ughId) return;
            return {
              to: user?.ughId,
              channel: "user",
              profile: user?.uploadUrl,
              title: user?.ughId,
            };
          })
          .filter((chat) => chat)
      : [];
  const areAllWinners =
    tournament?.winners?.filter((w) => w.position === -1).length ===
    tournament?.players?.length;
  const JoinButton = () => {
    const msIn30min = 1000 * 60 * 30;
    const canLeave =
      new Date(tournament?.startDateTime).valueOf() - Date.now() >= msIn30min;
    const isTournamentCompleted = tournament?.status === "completed";
    const isTournamentStarted = tournament?.status === "started";
    const isTournamentUpcoming = tournament?.status === "upcoming";
    const tournamentHasWinners = tournament?.winners.length > 0;
    const areSlotsAvailable =
      tournament?.players?.length * tournament?.group?.participants !==
      tournament?.playerCount;
    const wasPlayerDisqualified =
      tournament?.dqPlayers?.filter(
        (player) =>
          JSON.stringify(player?.id) === JSON.stringify(currentUser?.id)
      )?.length > 0;

    if (!currentUser && isTournamentUpcoming)
      return (
        <Link href="/login">
          <a>
            <Button text="Join" type="link" size="small" />
          </a>
        </Link>
      );
    else if (!currentUser && (isTournamentCompleted || isTournamentStarted))
      return <Button text="Game Over" type="disabled" size="medium" />;
    else if (
      currentUser &&
      areSlotsAvailable &&
      !userHasJoined &&
      tournament?.regId &&
      !(isTournamentCompleted || isTournamentStarted) &&
      new Date(tournament?.startDateTime).valueOf() > Date.now()
    )
      return (
        <DialogButton
          style={{ position: "fixed", minWidth: 360, maxWidth: 500 }}
          size="medium"
          title="Join"
          fullButton
          onAction={(onSuccess, onError) => doRequest(onSuccess, onError)}
        >
          <div style={{ fontSize: 20, marginBottom: 20, textAlign: "center" }}>
            <p>
              Please read the rules of the tournament before joining, as they
              vary for every tournament.
            </p>
            <p style={{ marginTop: 10 }}>
              You will be charged{" "}
              {tournament?.isFree ? 0 : tournament?.coins || 10} coins to join.
            </p>
          </div>
        </DialogButton>
      );
    else if (tournamentHasWinners)
      return (
        <DialogButton
          style={{ position: "fixed", minWidth: 400 }}
          size="medium"
          title="Winner List"
          fullButton
        >
          <table>
            <tr>
              <td>Position</td>
              <td>UghId</td>
              <td>Prize</td>
            </tr>
            {tournament?.winners.map((winner) => {
              const position =
                winner.position === -1
                  ? "Hournable"
                  : `${winner?.position}${numberPostion(winner?.position)}`;
              return (
                <tr key={Math.random()} style={{ fontSize: 20 }}>
                  <td>{position}</td>
                  <td>{winner.ughId}</td>
                  <td>{winner.coins} coins</td>
                </tr>
              );
            })}
          </table>
        </DialogButton>
      );
    else if (currentUser && wasPlayerDisqualified)
      return <Button text="Disqualified" type="youtube" />;
    else if (
      currentUser &&
      !areSlotsAvailable &&
      !userHasJoined &&
      isTournamentUpcoming
    )
      return <Button text="Slots Full" type="disabled" />;
    else if (currentUser && userHasJoined && canLeave && isTournamentUpcoming)
      return (
        <DialogButton
          title="Dropout"
          onAction={leaveRequest}
          fullButton
          size="small"
          type="youtube"
          style={{ position: "fixed", minWidth: 360, maxWidth: 500 }}
        >
          <div style={{ fontSize: 20, marginBottom: 20, textAlign: "center" }}>
            <p>
              {tournament?.isFree ? null : (
                <div>You will be charged 50% of entry coins as penalty.</div>
              )}
            </p>
            <p style={{ marginTop: 10 }}>Are you sure?</p>
          </div>
        </DialogButton>
      );
    else if (currentUser && userHasJoined && isTournamentUpcoming)
      return <Button text="Joined" type="facebook" size="small" />;
    else if (currentUser && userHasJoined && isTournamentStarted)
      return (
        <Link href={`/game/${tournament?.regId}`}>
          <a>
            <Button text="View Brackets" type="link" size="medium" />
          </a>
        </Link>
      );
    else return <Button text="Game Over" type="disabled" size="medium" />;
  };

  const statusText = () => {
    let text = "",
      color = "white";

    const status = tournament?.status;
    const winners = tournament?.winners?.length;
    const endDateTime = new Date(tournament?.endDateTime).valueOf();
    const players = tournament?.players?.length || 0;
    const participants = tournament?.group?.participants || 0;
    const playerCount = tournament?.playerCount || 1;
    const cutoff = tournament?.game?.cutoff || 10;

    const attendance = ((players * participants) / playerCount) * 100;

    if (status === "completed" && winners === 0) {
      text = "No Winners";
      color = "red";
    }
    if (status === "completed" && attendance < cutoff) {
      text = "Tournament Cancelled";
      color = "red";
    }
    if (status === "started" && Date.now() > endDateTime) {
      text = "Under Review, Tournament In Progress";
      color = "yellow";
    }

    return text ? (
      <div
        style={{
          textAlign: "center",
          margin: "10px 0",
          color,
          fontSize: 36,
          textTransform: "uppercase",
        }}
      >
        {text}
      </div>
    ) : null;
  };

  const { doRequest } = useRequest({
    url: `/api/ugh/tournament/join/${tournament?.id}`,
    body: {},
    method: "get",
    onSuccess: Router.reload,
    onError: (errors) => setMessages(errors),
  });

  const { doRequest: leaveRequest } = useRequest({
    url: `/api/ugh/tournament/leave/${tournament?.id}`,
    body: {},
    method: "get",
    onSuccess: Router.reload,
    onError: (errors) => setMessages(errors),
  });

  const getTimer = () => {
    if (!tournament) return null;
    const cdt = Date.now();
    const sdt = new Date(tournament.startDateTime).getTime();
    const edt = new Date(tournament.endDateTime).getTime();
    if (tournament.status === "completed") return <div>Completed</div>;
    else if (cdt < sdt)
      return (
        <Timer
          canCountdown={!!tournament.startDateTime}
          dateTime={tournament.startDateTime}
          placeholder="To Start"
        />
      );
    else if (cdt < edt)
      return (
        <Timer
          canCountdown={!!tournament.endDateTime}
          dateTime={tournament.endDateTime}
          placeholder="To End"
        />
      );
  };

  return (
    <MainLayout messages={messages}>
      <div className="tournament">
        <div className="tournament__container">
          <div className="tournament__card">
            <div
              className="tournament__card__head"
              style={{ backgroundImage: `url(${tournament?.game?.imageUrl})` }}
            >
              <div className="tournament__card__head__title">
                {tournament?.name}
              </div>
              <div className="tournament__card__head__time">{getTimer()}</div>
              <div className="tournament__card__head__time">{getTimer()}</div>

              {tournament?.winners?.length > 0 && (
                <div className="tournament__card__head__winner">
                  <IoIosTrophy className="tournament__card__head__winner__icon" />
                  {areAllWinners ? null : (
                    <div className="tournament__card__head__winner__name">
                      <div>{tournament.winners[0].ughId}</div>
                      <div>{tournament.winners[0].coins} coins</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="tournament__card__body">
              {statusText()}
              <div className="tournament__card__body__upper">
                <div className="tournament__card__body__upper__left">
                  <img
                    src={tournament?.game?.thumbnailUrl}
                    alt={tournament?.game?.name}
                    className="tournament__card__body__upper__left__image"
                  />
                </div>
                <div className="tournament__card__body__upper__right">
                  <div style={{ marginRight: 5, fontSize: 20, color: "white" }}>
                    Match Prize {tournament?.winnerCoin} coins{" "}
                  </div>
                  <IconDialogButton
                    Icon={BsFillInfoCircleFill}
                    style={{ position: "fixed", minWidth: 400 }}
                    iconStyle={{
                      color: "blue",
                      fontSize: 20,
                      cursor: "pointer",
                      marginRight: 5,
                    }}
                  >
                    <table>
                      <tr>
                        <td>position</td>
                        <td>Prize</td>
                      </tr>
                      {prizeDistribution(
                        tournament?.winnerCoin || 100,
                        tournament?.winnerCount || 1
                      ).map((prize, index) => {
                        return (
                          <tr key={Math.random()} style={{ fontSize: 20 }}>
                            <td>{`${index + 1}${numberPostion(index + 1)}`}</td>
                            <td>{prize} coins</td>
                          </tr>
                        );
                      })}
                    </table>
                  </IconDialogButton>
                  <div style={{ marginRight: 10 }}>{JoinButton()}</div>
                  <div>
                    {tournament?.status === "completed" &&
                    userHasJoined &&
                    tournament?.brackets?.length > 0 ? (
                      <Link href={`/game/${tournament?.regId}`}>
                        <a>
                          <Button
                            text="View Brackets"
                            size="medium"
                            type="github"
                          />
                        </a>
                      </Link>
                    ) : (
                      <DialogButton
                        title="View Rules"
                        type="github"
                        size="medium"
                        style={{
                          position: "fixed",
                          width: "38rem",
                          height: "50rem",
                          overflowY: "scroll",
                        }}
                        fullButton
                      >
                        <h2>RULES OF THE GAME</h2>
                        <div style={{ width: "30rem", margin: "0 auto" }}>
                          <RichText content={tournament?.game?.rules} />
                        </div>
                      </DialogButton>
                    )}
                  </div>
                </div>
              </div>
              <div className="tournament__card__body__lower">
                <div className="tournament__card__body__lower__left">
                  <div className="tournament__card__body__lower__left__item">
                    <div style={{ marginBottom: 10 }}>Entry Coins</div>
                    <div>
                      {tournament?.isFree
                        ? "FREE"
                        : `${
                            tournament?.coins /
                              tournament?.group?.participants || 0
                          } coins`}
                    </div>
                  </div>
                  <div className="tournament__card__body__lower__left__item">
                    <div style={{ marginBottom: 10 }}>Platform</div>
                    <div>
                      {tournament?.game?.console?.toUpperCase() || "NA"}
                    </div>
                  </div>
                  <div className="tournament__card__body__lower__left__item">
                    <div style={{ marginBottom: 10 }}>Participants</div>
                    <div>
                      {tournament?.players?.length *
                        tournament?.group?.participants || 0}
                      /{tournament?.playerCount || 0}
                    </div>
                  </div>
                  {tournament?.group && (
                    <div className="tournament__card__body__lower__left__item">
                      <div style={{ marginBottom: 10 }}>Teams</div>
                      <div>
                        {tournament?.group?.name.toUpperCase()} -{" "}
                        {tournament?.group?.participants} players
                      </div>
                    </div>
                  )}
                  <div className="tournament__card__body__lower__left__item">
                    <div style={{ marginBottom: 10 }}>Starts On</div>
                    <div>
                      {format(
                        new Date(tournament?.startDateTime || Date.now()),
                        "dd/MM/yyyy hh:mm a"
                      )}
                    </div>
                  </div>
                  <div className="tournament__card__body__lower__left__item">
                    <div style={{ marginBottom: 10 }}>Ends On</div>
                    <div>
                      {format(
                        new Date(tournament?.endDateTime || Date.now()),
                        "dd/MM/yyyy hh:mm a"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {currentUser && userHasJoined && tournament?.players?.length > 0 ? (
          <div className="tournament__container tournament__container--footer">
            <div className="tournament__container--footer__title">
              Meet The Competitors
            </div>
            <div className="tournament__container__list">
              {tournament?.players?.map((player) => (
                <PlayerCard
                  key={Math.random()}
                  currentUser={currentUser}
                  player={player}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {(currentUser?.role === "admin" || userHasJoined) && (
        <MessengerList
          from={currentUser?.ughId}
          currentUser={currentUser}
          chats={[
            { channel: "admin", title: "admin", to: "admin", profile: Logo },
            { channel: "match", title: "match chat", to: tournament?.regId },
            ...chats,
          ]}
        />
      )}
    </MainLayout>
  );
};

TournamentDetail.getInitialProps = async (ctx) => {
  const { tournamentId } = ctx.query;
  const { data: tournament, errors: errorsA } = await serverRequest(ctx, {
    url: `/api/ugh/tournament/fetch/detail/${tournamentId}`,
    method: "get",
    body: {},
  });

  const errors = [];
  if (errorsA) errors.push(...errorsA);

  return {
    tournament,
    errors,
  };
};

export default TournamentDetail;
