import React, { useState, useEffect } from "react";
import SideLayout from "../../../components/layout/sidelayout";
import Table from "../../../components/table";
import SocialButton from "../../../components/button/social";
import { useRequest } from "../../../hooks/use-request";
import { StreamDoc } from "../../../../server/models/stream";
import Link from "next/link";
import Switch from "react-switch";
import { GameDoc } from "../../../../server/models/game";
import DialogButton from "../../../components/button/dialog";
import Input from "../../../components/input/input";
import Select from "../../../components/input/select";
import FileInput from "../../../components/input/file";
import Option from "../../../components/input/option";
import { socialOptions } from "../../../public/resource";
import Router from "next/router";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import IconDialogButton from "../../../components/button/icon-dialog";

const AdminStreamDashboard = () => {
  // states
  const [streamData, setStreamData] = useState([]);
  const [games, setGames] = useState([]);
  const [name, setName] = useState("");
  const [href, setHref] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [social, setSocial] = useState(socialOptions[0]);
  const [game, setGame] = useState("");
  const [messages, setMessages] = useState([]);
  // components
  const SwitchBlade = (id: string, activity: boolean) => {
    return (
      <Switch checked={activity} onChange={() => changeStreamActivity(id)} />
    );
  };
  const EditLink = (id: string) => (
    <Link href={`/admin/streams/${id}`}>
      <a className="table__link">
        <AiOutlineEdit style={{ color: "green", fontSize: 24 }} />
      </a>
    </Link>
  );
  // request
  const { doRequest } = useRequest({
    url: "/api/ugh/stream/fetch/all",
    body: {},
    method: "get",
    onSuccess: (data: Array<StreamDoc>) => {
      setStreamData(
        data.map((stream) => [
          <>
            <div>{stream.name.toUpperCase()}</div>
            <div>({stream.game.toUpperCase()})</div>
          </>,
          <SocialButton
            type={stream.social}
            href={stream.href}
            target="_blank"
          />,
          SwitchBlade(stream.id, stream.isActive),
          EditLink(stream.id),
          <IconDialogButton
            Icon={AiFillDelete}
            iconStyle={{ color: "red", fontSize: 24 }}
            style={{ width: 300 }}
            onAction={(onSuccess, onError) => {
              const { doRequest: deleteUser } = useRequest({
                url: `/api/ugh/admin/delete/stream/${stream.id}`,
                method: "delete",
                body: {},
                onSuccess: Router.reload,
                onError: setMessages,
              });
              deleteUser(onSuccess, onError);
            }}
          >
            <div style={{ margin: 10, fontSize: 18 }}>Are you Sure?</div>
          </IconDialogButton>,
        ])
      );
    },
    onError: (errors) => setMessages(errors),
  });
  const { doRequest: getGamesRequest } = useRequest({
    url: "/api/ugh/game/fetch/active",
    body: {},
    method: "get",
    onSuccess: (data: Array<GameDoc>) => setGames(data),
    onError: (errors) => setMessages(errors),
  });
  const { doRequest: addStreamRequest } = useRequest({
    url: "/api/ugh/stream/add",
    method: "post",
    body: {
      name,
      href,
      game,
      social,
      imageUrl,
    },
    onSuccess: async () => {
      setMessages([{ message: "Successfully added stream", type: "success" }]);
      doRequest();
    },
    onError: (errors) => setMessages(errors),
  });
  // effect
  useEffect(() => {
    doRequest();
    getGamesRequest();
  }, []);
  useEffect(() => {
    if (games.length > 0) setGame(games[0].name);
  }, [games]);
  // method
  const changeStreamActivity = async (id: string) => {
    const { doRequest: updateStreamRequest } = useRequest({
      url: `/api/ugh/stream/update/activity/${id}`,
      method: "put",
      body: {},
    });
    await updateStreamRequest();
    await doRequest();
  };

  const onChangeHandler = (name: string, val: string) => {
    switch (name) {
      case "name":
        return setName(val);
      case "href":
        return setHref(val);
      case "imageUrl":
        return setImageUrl(val);
    }
  };
  const onSelectHandler = (e: any) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    switch (name) {
      case "social":
        return setSocial(value);
      case "game":
        return setGame(value);
    }
  };
  // render
  return (
    <SideLayout messages={messages} title={`streams(${streamData.length})`}>
      <DialogButton title="add stream" onAction={addStreamRequest}>
        <Input
          name="name"
          placeholder="name"
          value={name}
          onChange={onChangeHandler}
        />
        <Input
          name="href"
          placeholder="href"
          value={href}
          onChange={onChangeHandler}
        />
        <Select
          name="game"
          onSelect={onSelectHandler}
          value={game}
          placeholder="game"
          options={games.map((game: GameDoc) => {
            return (
              <Option display={game.name} value={game.name} key={game.name} />
            );
          })}
        />
        <Select
          name="social"
          onSelect={onSelectHandler}
          value={social}
          placeholder="social"
          options={socialOptions.map((name) => {
            return <Option display={name} value={name} key={name} />;
          })}
        />
        <FileInput
          name="imageUrl"
          onChange={onChangeHandler}
          placeholder="thumbnail image"
          showImage
        />
      </DialogButton>
      <Table
        headers={[
          {
            text: "name",
            isResponsive: false,
          },
          {
            text: "social-link",
            isResponsive: false,
          },
          {
            text: "activity",
            isResponsive: false,
          },
          {
            text: "edit",
            isResponsive: true,
          },
          {
            text: "delete",
            isResponsive: true,
          },
        ]}
        data={streamData}
      />
    </SideLayout>
  );
};

export default AdminStreamDashboard;
