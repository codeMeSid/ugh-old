import Button from "../../../components/button/main";
import Input from "../../../components/input/input";
import { serverRequest } from "../../../hooks/server-request";
import { GameDoc } from "../../../../server/models/game";
import Select from "../../../components/input/select";
import Option from "../../../components/input/option";
import { ConsoleDoc } from "../../../../server/models/console";
import SideLayout from "../../../components/layout/sidelayout";
import { useState } from "react";
import { useRequest } from "../../../hooks/use-request";
import Router from "next/router";
import ProgressButton from "../../../components/button/progress";

const AddTournament = ({
  games,
  consoles,
  errors,
}: {
  games: Array<GameDoc>;
  consoles: Array<ConsoleDoc>;
  errors: Array<any>;
}) => {
  const [consoleIndex, setConsoleIndex] = useState(0);
  const [gameIndex, setGameIndex] = useState(0);
  const [pIndex, setPIndex] = useState(0);
  const [gIndex, setGIndex] = useState(0);
  const [name, setName] = useState("");
  const [coins, setCoins] = useState(10);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [wI, setWI] = useState(0);
  const [messages, setMessages] = useState(errors);

  const onChangeHandler = (name: String, val: any) => {
    switch (name) {
      case "name":
        return setName(val);
      case "coins":
        return setCoins(val);
      case "startDateTime":
        return setStartDateTime(val);
      case "endDateTime":
        return setEndDateTime(val);
      case "winnerCount":
        return setWI(val);
    }
  };
  const onSelectHandler = (e) => {
    const name = e.currentTarget.name;
    const val = e.currentTarget.value;
    switch (name) {
      case "consoleIndex":
        setConsoleIndex(val);
        setGameIndex(0);
        setPIndex(0);
        setGIndex(0);
        setWI(0);
        break;
      case "gameIndex":
        setGameIndex(val);
        setPIndex(0);
        setGIndex(0);
        setWI(0);
        break;
      case "pIndex":
        setPIndex(val);
        break;
      case "gIndex":
        setGIndex(val);
        break;
      case "winnerIndex":
        setWI(val);
        break;
    }
  };

  const onTouramentCreateHandler = async (next: any, isFree: boolean) => {
    const iGame = games?.filter(
      (game) => game.console === consoles[consoleIndex]?.name
    )[gameIndex];
    const iGameParticipants = iGame?.participants[pIndex];
    if (iGame.gameType === "score" && iGameParticipants >= 4) {
      const _sdt = new Date(startDateTime).valueOf();
      const _edt = new Date(endDateTime).valueOf();
      const _dt = (_edt - _sdt) / (1000 * 60 * 60);
      const recommendedTime = Math.ceil(
        Math.log2(games[gameIndex]?.participants[pIndex])
      );
      if (_dt < recommendedTime) {
        next(false, "Failed");
        return setMessages([
          {
            message:
              "Atleast 2 hours of tournament time is required for this game.",
          },
        ]);
      }
    }
    const body = {
      name,
      coins: coins || 0,
      isFree,
      winnerCount:
        games?.filter((game) => game.console === consoles[consoleIndex]?.name)[
          gameIndex
        ]?.winners[wI] || 1,
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
      game: games?.filter(
        (game) => game.console === consoles[consoleIndex]?.name
      )[gameIndex]?.id,
      playerCount:
        games?.filter((game) => game.console === consoles[consoleIndex]?.name)[
          gameIndex
        ]?.participants[pIndex] || 0,
      group: games?.filter(
        (game) => game.console === consoles[consoleIndex]?.name
      )[gameIndex].groups[gIndex],
    };
    const { doRequest } = useRequest({
      url: "/api/ugh/tournament/add",
      body,
      method: "post",
      onSuccess: () => Router.replace("/admin/tournaments"),
      onError: (errors) => setMessages(errors),
    });
    await doRequest();
    next();
  };
  return (
    <SideLayout messages={messages} title="add match">
      <div className="detail">
        <div className="row">
          <div className="col">
            <Input
              placeholder="name"
              name="name"
              value={name}
              onChange={onChangeHandler}
            />
          </div>
          <div className="col">
            <Input
              type="number"
              placeholder="coins"
              name="coins"
              value={coins}
              onChange={onChangeHandler}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Select
              onSelect={onSelectHandler}
              name="winnerIndex"
              placeholder="winner"
              value={wI}
              options={games
                ?.filter(
                  (game) => game.console === consoles[consoleIndex]?.name
                )
                [gameIndex]?.winners?.map((w: number, index: number) => {
                  return <Option key={w} display={w} value={index} />;
                })}
            />
          </div>
          <div className="col">
            <Select
              onSelect={onSelectHandler}
              name="consoleIndex"
              placeholder="console"
              value={consoleIndex}
              options={consoles?.map((console: ConsoleDoc, index: number) => {
                return (
                  <Option
                    key={console.name}
                    display={console.name.toUpperCase()}
                    value={index}
                  />
                );
              })}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Input
              type="datetime-local"
              placeholder="start at"
              onChange={onChangeHandler}
              name="startDateTime"
            />
          </div>
          <div className="col">
            <Input
              type="datetime-local"
              placeholder="end at"
              onChange={onChangeHandler}
              name="endDateTime"
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Select
              onSelect={onSelectHandler}
              name="gameIndex"
              placeholder={`game (${
                games?.filter(
                  (game) => game.console === consoles[consoleIndex]?.name
                )[gameIndex].gameType
              })`}
              value={gameIndex}
              options={games
                ?.filter(
                  (game) => game.console === consoles[consoleIndex]?.name
                )
                ?.map((game: GameDoc, index: number) => {
                  return (
                    <Option key={game.name} display={game.name} value={index} />
                  );
                })}
            />
          </div>
          <div className="col">
            <Select
              onSelect={onSelectHandler}
              name="pIndex"
              placeholder="participants"
              value={pIndex}
              options={games
                ?.filter(
                  (game) => game.console === consoles[consoleIndex]?.name
                )
                [gameIndex]?.participants?.map((p, index: number) => {
                  return <Option key={p} display={p} value={index} />;
                })}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Select
              onSelect={onSelectHandler}
              name="gIndex"
              placeholder="group"
              value={gIndex}
              options={games
                ?.filter(
                  (game) => game.console === consoles[consoleIndex]?.name
                )
                [gameIndex]?.groups?.map((g, index: number) => {
                  return (
                    <Option
                      key={g.name}
                      display={`${g.name}-${g.participants}`}
                      value={index}
                    />
                  );
                })}
            />
          </div>
        </div>
        <div className="row">
          <ProgressButton
            size="large"
            text="Paid"
            type="whatsapp"
            onPress={(_, next) => onTouramentCreateHandler(next, false)}
          />
          <ProgressButton
            size="large"
            text="Free"
            type="github"
            onPress={(_, next) => onTouramentCreateHandler(next, true)}
          />
        </div>
      </div>
    </SideLayout>
  );
};

AddTournament.getInitialProps = async (ctx) => {
  const { data: consoles, errors: errorsA } = await serverRequest(ctx, {
    url: "/api/ugh/console/fetch/active",
    body: {},
    method: "get",
  });
  const { data: games, errors: errorsB } = await serverRequest(ctx, {
    url: "/api/ugh/game/fetch/active",
    body: {},
    method: "get",
  });
  const errors = [];
  if (errorsA) errors.push(...errorsA);
  if (errorsB) errors.push(...errorsB);
  return {
    consoles: consoles || [],
    games: games || [],
    errors,
  };
};

export default AddTournament;
