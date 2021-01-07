import Link from "next/link";
import { TournamentDoc } from "../../../server/models/tournament";
import MainLayout from "../../components/layout/mainlayout";
import { serverRequest } from "../../hooks/server-request";
import { format } from "date-fns";
import { useRequest } from "../../hooks/use-request";
import Button from "../../components/button/main";
import React, { useRef, useState } from "react";
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
import { IoMdCloseCircle } from "react-icons/io";
import ProgressButton from "../../components/button/progress";
import Input from "../../components/input/input";

const Logo = require("../../public/asset/logo_icon.webp");

const TournamentDetail = ({
  tournament,
  currentUser,
  userHasEarning,
  userHasWalletBalance,
  errors,
}: {
  tournament: TournamentDoc;
  matches: any;
  userHasEarning: boolean;
  userHasWalletBalance: boolean;
  currentUser: any;
  errors: any;
}) => {
  const [messages, setMessages] = useState(errors);
  const [canAddTM, setCanAddTM] = useState(false);
  const formRef = useRef(null);
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
    if (!tournament)
      return <Button text="Game Over" type="disabled" size="medium" />;
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
    ) {
      let text: any;
      if (userHasWalletBalance)
        text = (
          <>
            <p>
              Please read the rules of the tournament before joining, as they
              vary for every tournament.
            </p>
            <p style={{ marginTop: 10 }}>
              You will be charged{" "}
              {tournament?.isFree ? 0 : tournament?.coins || 10} coins to join.
            </p>
          </>
        );
      else if (userHasEarning)
        text = (
          <>
            <p>
              Please read the rules of the tournament before joining, as they
              vary for every tournament.
            </p>
            <p style={{ color: "red" }}>
              Insufficient coins to join. Do you want to join tournament using
              Earned coins?
            </p>
            <p style={{ marginTop: 10 }}>
              You will be charged{" "}
              {tournament?.isFree ? 0 : tournament?.coins || 10} coins to join.
            </p>
          </>
        );
      else
        text = (
          <p style={{ color: "red" }}>Insufficient Coins to join tournament.</p>
        );
      return (
        <DialogButton
          style={{ position: "fixed", minWidth: 360, maxWidth: 500 }}
          size="medium"
          title="Join"
          buttonText={
            userHasWalletBalance || userHasEarning ? "Submit" : "Shop Coins"
          }
          fullButton
          onAction={(onSuccess, onError) => {
            if (userHasWalletBalance || userHasEarning) {
              if (tournament?.group?.participants >= 2) {
                onSuccess("");
                setCanAddTM(true);
              } else doRequest(onSuccess, onError);
            } else Router.push("/shop");
          }}
        >
          <div style={{ fontSize: 20, marginBottom: 20, textAlign: "center" }}>
            {text}
          </div>
        </DialogButton>
      );
    } else if (tournamentHasWinners)
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
            <p style={{ marginTop: tournament?.isFree ? 0 : 10 }}>
              Are you sure?
            </p>
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
    method: "post",
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
      {canAddTM && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100vw",
              height: "100vh",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                maxWidth: 800,
                minWidth: 400,
                backgroundColor: "rgba(0,0,0,.8)",
                border: "1px solid rgba(255,255,255,.2)",
                padding: "10px 5px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  transform: "translate(50%,-50%)",
                  cursor: "pointer",
                }}
              >
                <IoMdCloseCircle
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => setCanAddTM(false)}
                />
              </div>
              <div
                style={{ fontSize: 36, color: "white", textAlign: "center" }}
              >
                Team Info
              </div>
              <form
                ref={formRef}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="scrollbar--white"
                style={{
                  minHeight: 200,
                  maxHeight: 600,
                  overflowY: "scroll",
                  overflowX: "hidden",
                }}
              >
                {Array((tournament?.group?.participants || 1) - 1)
                  .fill(0)
                  .map((t, i) => {
                    return (
                      <div key={Math.random()}>
                        <div style={{ color: "white", fontSize: 24 }}>
                          Player {i + 2}
                        </div>
                        <Input
                          placeholder="InGame ID*"
                          name={`namePlayer${i + 2}`}
                          isWhite
                        />
                        <Input
                          type="email"
                          placeholder="Email"
                          name={`emailPlayer${i + 2}`}
                          isWhite
                        />
                      </div>
                    );
                  })}
                <div style={{ textAlign: "right", marginTop: 10 }}>
                  <ProgressButton
                    type="link"
                    text="Join Tournament"
                    onPress={(_: any, next: any) => {
                      const inputs = Array.from(formRef.current);
                      inputs.pop();
                      const teamInputs = inputs.map((t: any) => t.value);
                      let players: any = {};
                      const mates = [];
                      const emailRegex = new RegExp(
                        "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}"
                      );
                      for (let i = 0; i < teamInputs.length; i++) {
                        if (i % 2 === 1) {
                          if (
                            teamInputs[i] &&
                            !emailRegex.test(teamInputs[i])
                          ) {
                            setMessages([
                              {
                                message: "Valid Team Player Email is required.",
                              },
                            ]);
                            next(false, "Failed");
                            return;
                          }
                          players.email = teamInputs[i];
                          mates.push(players);
                          players = {};
                        } else {
                          if (!teamInputs[i]) {
                            setMessages([
                              { message: "Team Player In GameId is required." },
                            ]);
                            next(false, "Failed");
                            return;
                          }
                          players.name = teamInputs[i];
                        }
                      }

                      doRequest(next, () => next(false, "Failed"), {
                        teamPlayers: mates,
                      });
                    }}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
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
                    style={{ position: "fixed", width: 400 }}
                    iconStyle={{
                      color: "blue",
                      fontSize: 20,
                      cursor: "pointer",
                      marginRight: 5,
                    }}
                  >
                    <table>
                      <tr>
                        <td>Position</td>
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
                    <p
                      style={{
                        color: "red",
                        marginTop: 10,
                        fontSize: 18,
                      }}
                    >
                      ** Note: The prize may vary depending on the number of
                      users joining the tournament.
                    </p>
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
  const { data, errors } = await serverRequest(ctx, {
    url: `/api/ugh/tournament/fetch/detail/${tournamentId}`,
    method: "get",
    body: {},
  });
  return {
    tournament: data?.tournament,
    userHasEarning: !!data?.userHasEarning,
    userHasWalletBalance: !!data?.userHasWalletBalance,
    errors,
  };
};

export default TournamentDetail;
