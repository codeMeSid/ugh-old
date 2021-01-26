import Button from "../components/button/main";
import Input from "../components/input/input";
import { serverRequest } from "../hooks/server-request";
import { GameDoc } from "../../server/models/game";
import Select from "../components/input/select";
import Option from "../components/input/option";
import { ConsoleDoc } from "../../server/models/console";
import { useState } from "react";
import { useRequest } from "../hooks/use-request";
import Router from "next/router";
import MainLayout from "../components/layout/mainlayout";
import DialogButton from "../components/button/dialog";

const bgImage = require("../public/asset/signup.jpg");

const AddTournament = ({
  gs,
  cs,
  errors,
}: {
  gs: Array<GameDoc>;
  cs: Array<ConsoleDoc>;
  errors: any;
}) => {
  const [wI, setWI] = useState(0);
  const [messages, setMessages] = useState(errors);
  const [games] = useState(gs);
  const [game, setGame] = useState(0);
  const [participants, setParticipants] = useState(0);
  const [group, setGroup] = useState(0);
  const [consoles] = useState(cs);
  const [console, setConsole] = useState(0);
  const [coins, setCoins] = useState(10);
  const [name, setName] = useState("");
  const [sdt, setSdt] = useState("");
  const [edt, setEdt] = useState("");
  const [sdd, setSdd] = useState(new Date());
  const [edd, setEdd] = useState(new Date());

  const onChangeHandler = (name: String, val: any) => {
    switch (name) {
      case "name":
        return setName(val);
      case "coins":
        return setCoins(val);
      case "startDate":
        return setSdd(val);
      case "endDate":
        return setEdd(val);
      case "startTime":
        return setSdt(val);
      case "endTime":
        return setEdt(val);
    }
  };
  const onSelectHandler = (e) => {
    const name = e.currentTarget.name;
    const val = e.currentTarget.value;
    switch (name) {
      case "console":
        setConsole(parseInt(val));
        setGame(0);
        setParticipants(0);
        setGroup(0);
        break;
      case "game":
        setGame(parseInt(val));
        setParticipants(0);
        setGroup(0);
        break;
      case "participants":
        setParticipants(parseInt(val));
        setGroup(0);
        break;
      case "group":
        setGroup(parseInt(val));
        break;
      case "winners":
        setWI(parseInt(val));
        break;
    }
  };

  const onTouramentCreateHandler = async (onSuccess: any, onError: any) => {
    const iGame = games?.filter(
      (game) => game.console === consoles[console]?.name
    )[game];
    const iGameParticipants = iGame?.participants[participants];
    if (!sdt || !edt) {
      setMessages([{ message: "Invalid schedule time" }]);
      onError();
      return;
    }
    const st = sdt.split(":");
    const et = edt.split(":");
    if (iGame.gameType === "score" && iGameParticipants >= 4) {
      const _sdd = new Date(sdd)
        .setHours(parseInt(st[0]), parseInt(st[1]), 0)
        .valueOf();
      const _edd = new Date(edd)
        .setHours(parseInt(et[0]), parseInt(et[1]), 0)
        .valueOf();
      const _dd = (_edd - _sdd) / (1000 * 60 * 60);
      const recommendedTime = Math.ceil(
        Math.log2(games[game]?.participants[participants])
      );
      if (_dd < recommendedTime)
        return setMessages([
          {
            message: `Atleast ${recommendedTime} hours of tournament time is required for this game.`,
          },
        ]);
    }
    const startDateTime = new Date(sdd)
      .setHours(parseInt(st[0]), parseInt(st[1]), 0)
      .valueOf();
    const endDateTime = new Date(edd)
      .setHours(parseInt(et[0]), parseInt(et[1]), 0)
      .valueOf();
    const body = {
      name,
      coins: coins || 0,
      winnerCount:
        games?.filter((game) => game.console === consoles[console]?.name)[game]
          ?.winners[wI] || 1,
      startDateTime,
      endDateTime,
      game: games?.filter((game) => game.console === consoles[console]?.name)[
        game
      ]?.id,
      playerCount:
        games?.filter((game) => game.console === consoles[console]?.name)[game]
          ?.participants[participants] || 0,
      group: games?.filter((game) => game.console === consoles[console]?.name)[
        game
      ].groups[group],
    };
    const { doRequest } = useRequest({
      url: "/api/ugh/tournament/add",
      body,
      method: "post",
      onSuccess: () => Router.replace("/my-tournament"),
      onError: (errors) => setMessages(errors),
    });
    await doRequest(onSuccess, onError);
  };

  return (
    <MainLayout messages={messages}>
      <div
        // style={{ backgroundImage: `url(${bgImage})` }}
        className="detail__bg profile"
      >
        <div className="detail" style={{ padding: "2rem" }}>
          <div style={{ color: "white", fontSize: 38 }}>Add Tournament</div>
          <div className="row">
            <div className="col">
              <Input
                placeholder="name"
                name="name"
                value={name}
                onChange={onChangeHandler}
                isWhite
              />
            </div>
            <div className="col">
              <Input
                type="number"
                placeholder="coins"
                name="coins"
                value={coins}
                onChange={onChangeHandler}
                isWhite
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Select
                name="winners"
                onSelect={onSelectHandler}
                value={wI}
                placeholder="winner"
                options={games
                  ?.filter((game) => game.console === consoles[console]?.name)
                  [game]?.winners?.map((w, index) => (
                    <Option key={w} display={w} value={index} />
                  ))}
                isWhite
              />
            </div>
            <div className="col">
              <Select
                name="console"
                onSelect={onSelectHandler}
                value={console}
                placeholder="console"
                options={cs.map((c, index) => (
                  <Option
                    key={c.name}
                    display={c.name.toUpperCase()}
                    value={index}
                  />
                ))}
                isWhite
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Input
                type="date"
                placeholder="start on"
                onChange={onChangeHandler}
                name="startDate"
                value={sdd}
                isWhite
              />
            </div>
            <div className="col">
              <Input
                type="time"
                placeholder="start at"
                onChange={onChangeHandler}
                name="startTime"
                value={sdt}
                isWhite
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Input
                type="date"
                placeholder="end on"
                onChange={onChangeHandler}
                name="endDate"
                value={edd}
                isWhite
              />
            </div>
            <div className="col">
              <Input
                type="time"
                placeholder="end at"
                onChange={onChangeHandler}
                name="endTime"
                value={edt}
                isWhite
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Select
                onSelect={onSelectHandler}
                name="game"
                placeholder={`game (${
                  games?.filter(
                    (game) => game.console === consoles[console]?.name
                  )[game]?.gameType
                })`}
                value={game}
                options={games
                  ?.filter((game) => game.console === consoles[console]?.name)
                  ?.map((g: GameDoc, index: number) => (
                    <Option key={g.name} display={g.name} value={index} />
                  ))}
                isWhite
              />
            </div>
            <div className="col">
              <Select
                onSelect={onSelectHandler}
                name="participants"
                placeholder="participants"
                value={participants}
                options={games
                  ?.filter((game) => game.console === consoles[console]?.name)
                  [game]?.participants.map((p, index) => (
                    <Option key={p} display={p} value={index} />
                  ))}
                isWhite
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Select
                onSelect={onSelectHandler}
                name="group"
                placeholder="group"
                value={group}
                options={games
                  ?.filter((game) => game.console === consoles[console]?.name)
                  [game]?.groups?.map((g, index) => (
                    <Option
                      key={g.name}
                      display={`${g.name}-${g.participants}`}
                      value={index}
                    />
                  ))}
                isWhite
              />
            </div>
          </div>
          <div className="row">
            <DialogButton
              fullButton
              title="Submit"
              onAction={onTouramentCreateHandler}
              style={{ top: "20%", position: "fixed" }}
            >
              <div
                style={{
                  margin: "2rem auto",
                  fontSize: "2rem",
                  minWidth: "40rem",
                  maxWidth: "50rem",
                }}
              >
                Creating tournament will cost you{" "}
                {coins * (games[game]?.groups[group]?.participants || 1)} coins
                from your account
              </div>
            </DialogButton>
          </div>
        </div>
      </div>
    </MainLayout>
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
    cs: consoles || [],
    gs: games || [],
    errors,
  };
};

export default AddTournament;
