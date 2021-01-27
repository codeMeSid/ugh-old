import { useState } from "react";
import SideLayout from "../../../../components/layout/sidelayout";
import Input from "../../../../components/input/input";
import FileInput from "../../../../components/input/file";
import { IoIosAddCircleOutline } from "react-icons/io";
import { serverRequest } from "../../../../hooks/server-request";
import { ConsoleDoc } from "../../../../../server/models/console";
import Select from "../../../../components/input/select";
import Option from "../../../../components/input/option";
import ProgressButton from "../../../../components/button/progress";
import { useRequest } from "../../../../hooks/use-request";
import Router from "next/router";
import TextEditor from "../../../../components/editor";
import { GameDoc } from "../../../../../server/models/game";

const AddGame = ({
  game,
  consoles,
  errors,
  currentUser,
}: {
  game: GameDoc;
  consoles: ConsoleDoc[];
  errors: any;
  currentUser?: any;
}) => {
  const [name, setName] = useState(game?.name || "");
  const [imageUrl, setImageUrl] = useState(game?.imageUrl || "");
  const [console, setConsole] = useState(
    game?.console || (consoles?.length > 1 ? consoles[0].name : "")
  );
  const [gameType, setGameType] = useState(game?.gameType || "score");
  const [thumbnailUrl, setThumbnailUrl] = useState(game?.thumbnailUrl || "");
  const [participant, setParticipant] = useState(5);
  const [participants, setParticipants] = useState(game?.participants || [4]);
  const [winner, setWinner] = useState(1);
  const [winners, setWinners] = useState(game?.winners || [1]);
  const [groups, setGroups] = useState(
    game?.groups || [{ name: "Single", participants: 1 }]
  );
  const [group, setGroup] = useState("duo");
  const [gParticipant, setGParticipant] = useState(2);
  const [cutoff, setCutoff] = useState(game?.cutoff || 50);
  const [rules, setRules] = useState(game?.rules || "");
  const [messages, setMessages] = useState(errors);

  const { doRequest } = useRequest({
    url: `/api/ugh/game/update/${game.id}`,
    body: {
      name,
      imageUrl,
      console,
      thumbnailUrl,
      participants,
      groups,
      cutoff,
      gameType,
      winners,
      rules,
    },
    method: "put",
    onSuccess: () => Router.replace("/admin/games"),
    onError: (errors) => setMessages(errors),
  });

  const onChangeHandler = (name: string, val: any) => {
    switch (name) {
      case "name":
        return setName(val);
      case "imageUrl":
        return setImageUrl(val);
      case "thumbnailUrl":
        return setThumbnailUrl(val);
      case "participant":
        return setParticipant(val);
      case "group":
        return setGroup(val);
      case "gParticipant":
        return setGParticipant(val);
      case "cutoff":
        return setCutoff(parseInt(val));
      case "winner":
        return setWinner(val);
      case "rules":
        return setRules(val);
    }
  };

  const onParticipantAddHandler = () => {
    const pIndex = participants.indexOf(participant);
    if (pIndex === -1) {
      const uP = [...participants];
      uP.push(participant);
      setParticipants(uP);
    }
  };

  const onWinnerAdd = () => {
    const wIndex = winners.indexOf(winner);
    if (wIndex === -1) {
      const uW = [...winners];
      uW.push(winner);
      setWinners(uW);
    }
  };

  const onGroupAddHandler = () => {
    const gIndex = groups.findIndex(
      (g) => g.name === group || g.participants === gParticipant
    );
    if (gIndex === -1) {
      const gP = [...groups];
      gP.push({ name: group, participants: gParticipant });
      setGroups(gP);
      setGroup("duo");
      setGParticipant(2);
    }
  };

  const onPillClickHanlder = (index: number) => {
    const pills = [...participants];
    pills.splice(index, 1);
    setParticipants(pills);
  };
  const onPillGroupClickHanlder = (index: number) => {
    const pills = [...groups];
    pills.splice(index, 1);
    setGroups(pills);
  };
  const onWinnerPillClickHanlder = (index) => {
    const pills = [...winners];
    pills.splice(index, 1);
    setWinners(pills);
  };

  return (
    <SideLayout currentUser={currentUser} messages={messages} title="edit game">
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
            <Select
              value={gameType}
              name="gameType"
              onSelect={(e) => setGameType(e.currentTarget.value)}
              placeholder="game evaluation type"
              options={["rank", "score"].map((type) => (
                <Option key={type} value={type} display={type.toUpperCase()} />
              ))}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Select
              value={console}
              name="console"
              onSelect={(e) => setConsole(e.currentTarget.value)}
              placeholder="console"
              options={consoles?.map((console: ConsoleDoc) => (
                <Option
                  key={console.name}
                  value={console.name}
                  display={console.name.toUpperCase()}
                />
              ))}
            />
          </div>
          <div className="col">
            <Input
              placeholder="minimum player %"
              name="cutoff"
              onChange={onChangeHandler}
              value={cutoff}
              type="number"
            />
          </div>
        </div>
        <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
          <FileInput
            showImage
            name="imageUrl"
            placeholder="main image"
            onChange={onChangeHandler}
            value={imageUrl}
          />
        </div>
        <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
          <FileInput
            showImage
            name="thumbnailUrl"
            placeholder="thmbnail image"
            onChange={onChangeHandler}
            value={thumbnailUrl}
          />
        </div>
        <div className="row">
          <div className="col">
            <Input
              placeholder="participant"
              name="participant"
              value={participant}
              type="number"
              onChange={onChangeHandler}
            />
          </div>
          <div className="col">
            <IoIosAddCircleOutline
              style={{ fontSize: "2.6rem", cursor: "pointer" }}
              onClick={onParticipantAddHandler}
            />
          </div>
        </div>
        <div className="row">
          {participants.map((val, index) => {
            return (
              <div
                onClick={() => onPillClickHanlder(index)}
                className="pill"
                key={val}
              >
                {val}
              </div>
            );
          })}
        </div>
        <div className="row">
          <div className="col">
            <Input
              placeholder="winner"
              name="winner"
              value={winner}
              type="number"
              onChange={onChangeHandler}
            />
          </div>
          <div className="col">
            <IoIosAddCircleOutline
              style={{ fontSize: "2.6rem", cursor: "pointer" }}
              onClick={onWinnerAdd}
            />
          </div>
        </div>
        <div className="row">
          {winners.map((val, index) => {
            return (
              <div
                onClick={() => onWinnerPillClickHanlder(index)}
                className="pill"
                key={val}
              >
                {val}
              </div>
            );
          })}
        </div>
        <div className="row">
          <div className="col">
            <Input
              placeholder="group"
              name="group"
              onChange={onChangeHandler}
              value={group}
            />
          </div>
          <div className="col">
            <Input
              type="number"
              placeholder="group participant"
              name="gParticipant"
              onChange={onChangeHandler}
              value={gParticipant}
            />
          </div>
        </div>
        <div className="row">
          <IoIosAddCircleOutline
            style={{ fontSize: "2.6rem", cursor: "pointer" }}
            onClick={onGroupAddHandler}
          />
        </div>
        <div className="row">
          {groups.map((val, index) => {
            return (
              <div
                onClick={() => onPillGroupClickHanlder(index)}
                className="pill"
                key={Math.random()}
              >
                {val.name}-{val.participants}
              </div>
            );
          })}
        </div>
        <div className="row">
          <TextEditor name="rules" onChange={onChangeHandler} value={rules} />
        </div>
        <div className="row">
          <ProgressButton
            text="Update"
            type="whatsapp"
            size="large"
            onPress={(_, next) =>
              doRequest(
                () => next(),
                () => next(false, "Failed")
              )
            }
          />
        </div>
      </div>
    </SideLayout>
  );
};

AddGame.getInitialProps = async (ctx) => {
  const { data: consoles, errors: errorsA } = await serverRequest(ctx, {
    url: "/api/ugh/console/fetch/active",
    method: "get",
    body: {},
  });

  const { gameId } = ctx.query;
  const { data: game, errors: errorsB } = await serverRequest(ctx, {
    url: `/api/ugh/game/fetch/detail/${gameId}`,
    body: {},
    method: "get",
  });
  const errors = [];
  if (errorsA) errors.push(...errorsA);
  if (errorsB) errors.push(...errorsB);

  return { consoles: consoles || [], game, errors };
};

export default AddGame;
