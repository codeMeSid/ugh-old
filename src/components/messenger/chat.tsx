import { format } from "date-fns";
import React, { Component } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { ConversationDoc } from "../../../server/models/message";
import { SocketChannel } from "../../../server/utils/enum/socket-channel";
import { SocketMessage } from "../../../server/utils/interface/socket-message";
import { useRequest } from "../../hooks/use-request";
import { event } from "../../socket";

interface Props {
  from: string;
  to: string;
  channel: string;
  profile: any;
  title: string;
  onClose: any;
  onOpenMenu: any;
}

class MessengerChat extends Component<Props> {
  state = {
    chats: [],
    text: "",
  };

  constructor(props) {
    super(props);
    this.updateChat = this.updateChat.bind(this);
    this.getChat = this.getChat.bind(this);
    this.onTextSubmit = this.onTextSubmit.bind(this);
  }

  componentDidMount() {
    event.recieveMessage(this.updateChat);
    const { from, channel, to } = this.props;
    if (to) this.getChat({ from, to, channel });
  }
  componentDidUpdate(prevProps: Props) {
    const { to } = prevProps;
    const data = this.props;
    if (to !== data.to)
      this.setState({ chats: [] }, () =>
        this.getChat({ to: data.to, channel: data.channel, from: data.from })
      );
  }

  getChat(data: { from: string; to: string; channel: string }) {
    const { doRequest } = useRequest({
      url: "/api/ugh/message/fetch",
      body: data,
      method: "post",
      onSuccess: (data: ConversationDoc) => {
        if (data) this.setState({ chats: data.messages.reverse() || [] });
      },
    });
    doRequest();
  }

  updateChat = (data: SocketMessage) => {
    let chat: any;
    const { to, from } = this.props;
    switch (data.channel) {
      case SocketChannel.Admin:
        if (data.to === "admin" && data.from === to && from === "admin")
          chat = {
            ughId: data.from,
            text: data.text,
            createdAt: data.createdAt,
          };
        else if (data.from === "admin" && data.to === from)
          chat = { ughId: "admin", text: data.text, createdAt: data.createdAt };
        break;
      case SocketChannel.Match:
        if (data.to === to)
          chat = {
            ughId: data.from,
            text: data.text,
            createdAt: data.createdAt,
          };
        break;
      case SocketChannel.User:
        if (data.to === from && data.from === to)
          chat = {
            ughId: data.from,
            text: data.text,
            createdAt: data.createdAt,
          };
        break;
    }
    if (chat) this.setState((ps: any) => ({ chats: [chat, ...ps.chats] }));
  };

  async getConversation() {
    let response;
    const { doRequest } = useRequest({
      url: "",
      body: {},
      method: "post",
      onSuccess: (data) => {
        response = data;
      },
    });
    await doRequest();
    return response;
  }

  onTextSubmit(e: any) {
    e.preventDefault();
    const { text } = this.state;
    const { to, from, channel } = this.props;
    if (!text) return;

    const textToHtml = text
      .split(" ")
      .map((t) => {
        const urlRegexs = [
          "(https|http)(://)(ww[a-z0-9]?[.])([a-zA-z0-9]*)([.][a-z]*)+",
          "(ww[a-z0-9]?[.])([a-zA-z0-9]*)([.][a-z]*)+",
          "(https|http)(://)([a-zA-z0-9]*)([.][a-z]*)+",
          // "([a-zA-z0-9]*)([.][a-z]*)+",
        ];
        for (let i = 0; i < urlRegexs.length; i++) {
          const regex = new RegExp(urlRegexs[i]);
          if (regex.test(t)) {
            switch (i) {
              case 0:
                t = `<a style="color:blue;" href="${t}">${t}</a>`;
                break;
              case 1:
                t = `<a style="color:blue;" href="http://${t}">${t}</a>`;
                break;
              case 2:
                const tEmp = t.split("//");
                tEmp[1] = `www.${tEmp[1]}`;
                const tFin = tEmp.join("//");
                t = `<a style="color:blue;" href="${tFin}">${t}</a>`;
                break;
              // case 3:
              //   t = `<a style="color:blue;" href="http://www.${t}">${t}</a>`;
              //   break;
            }
            break;
          }
        }
        console.log(t);
        return t;
      })
      .join(" ");

    event.sendMessage({
      to,
      from,
      channel,
      createdAt: Date.now(),
      text: textToHtml,
    });
    this.setState((ps: any) => ({
      chats: [
        { ughId: from, text: textToHtml, createdAt: Date.now() },
        ...ps.chats,
      ],
      text: "",
    }));
  }

  render() {
    const {
      profile,
      onOpenMenu,
      onClose,
      title,
      from,
      channel,
      to,
    } = this.props;
    const { chats, text } = this.state;
    return (
      <div className="messenger">
        <div className="messenger__head">
          <GiHamburgerMenu
            className="messenger__head__menu"
            onClick={onOpenMenu}
          />
          <div
            className="messenger__head__profile"
            style={{ backgroundImage: `url(${profile})` }}
          />
          <div className="messenger__head__name">{title}</div>
          <IoMdClose className="messenger__head__close" onClick={onClose} />
        </div>
        <div className={`messenger__body ${to ? "" : "ugh"}`}>
          {to ? (
            chats.map((chat) => {
              return (
                <div
                  key={Math.random()}
                  className={`messenger__message ${
                    chat.ughId === from ? "active" : ""
                  }`}
                >
                  {chat.ughId === from ? (
                    <div style={{ marginTop: 2 }} />
                  ) : (
                    <div className="messenger__message__head">{chat.ughId}</div>
                  )}
                  {/* <div className="messenger__message__text">{chat.text}</div> dangerouslySetInnerHTML */}
                  <div
                    className="messenger__message__text"
                    dangerouslySetInnerHTML={{ __html: chat.text }}
                  />
                  <div className="messenger__message__date">
                    {format(chat.createdAt, "hh:mm a")}
                  </div>
                </div>
              );
            })
          ) : (
            <>
              <div className="messenger__message ugh">
                <div className="messenger__message__head">{from}</div>
                <div className="messenger__message__text ugh">
                  Select the contact to initiate chat
                </div>
                <div className="messenger__message__date">
                  {format(new Date(), "hh:mm a")}
                </div>
              </div>
            </>
          )}
        </div>
        {to && (
          <form className="messenger__form" onSubmit={this.onTextSubmit}>
            <input
              onChange={(e) => {
                this.setState({ text: e.currentTarget.value });
              }}
              type="text"
              className="messenger__input"
              placeholder="Enter text and hit Enter"
              value={text}
            />
          </form>
        )}
      </div>
    );
  }
}

export default MessengerChat;
