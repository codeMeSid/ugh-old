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
        text: ""
    }

    constructor(props) {
        super(props);
        this.updateChat = this.updateChat.bind(this);
        this.getChat = this.getChat.bind(this);
    }

    componentDidMount() {
        event.recieveMessage(this.updateChat);
        const { from, channel, to } = this.props;
        if (to) this.getChat({ from, to, channel });
    }
    componentDidUpdate(prevProps: Props) {
        const { to } = prevProps;
        const data = this.props;
        if (to !== this.props.to) this.setState({ chats: [] }, async () => this.getChat({ to: data.to, channel: data.channel, from: data.from }));
    }

    getChat(data: { from: string, to: string, channel: string }) {
        const { doRequest } = useRequest({
            url: "/api/ugh/message/fetch",
            body: data,
            method: "post",
            onSuccess: (data: ConversationDoc) => {
                if (data) this.setState({ chats: data.messages.reverse() || [] })
            }
        });
        doRequest();
    }

    updateChat = (data: SocketMessage) => {
        let chat: any;
        const { to, from } = this.props
        switch (data.channel) {
            case SocketChannel.Admin:
                if (data.to === "admin" && data.from === to && from === "admin") chat = { ughId: data.from, text: data.text, createdAt: data.createdAt };
                else if (data.from === "admin" && data.to === from) chat = { ughId: "admin", text: data.text, createdAt: data.createdAt };
                break;
            case SocketChannel.Match:
                if (data.to === to) chat = { ughId: data.from, text: data.text, createdAt: data.createdAt };
                break;
            case SocketChannel.User:
                if (data.to === from && data.from === to) chat = { ughId: data.from, text: data.text, createdAt: data.createdAt };
                break;
        }
        if (chat) this.setState((ps: any) => ({ chats: [chat, ...ps.chats] }));
    }

    async getConversation() {
        let response;
        const { doRequest } = useRequest({
            url: "",
            body: {},
            method: "post",
            onSuccess: (data) => {
                response = data;
            }
        });
        await doRequest();
        return response;
    }

    render() {
        const { profile, onOpenMenu, onClose, title, from, channel, to } = this.props;
        const { chats, text } = this.state;
        return <div className="messenger">
            <div className="messenger__head">
                <GiHamburgerMenu className="messenger__head__menu" onClick={onOpenMenu} />
                <div className="messenger__head__profile" style={{ backgroundImage: `url(${profile})` }} />
                <div className="messenger__head__name">{title}</div>
                <IoMdClose className="messenger__head__close" onClick={onClose} />
            </div>
            <div className="messenger__body">
                {chats.map(chat => {
                    return <div key={Math.random()} className={`messenger__message ${chat.ughId === from ? "active" : ""}`}>
                        {chat.ughId === from
                            ? <div style={{ marginTop: 2 }} />
                            : <div className="messenger__message__head">{chat.ughId}</div>}
                        <div className="messenger__message__text">{chat.text}</div>
                        <div className="messenger__message__date">{format(chat.createdAt, "hh:mm a")}</div>
                    </div>
                })}
            </div>
            <form className="messenger__form" onSubmit={(e) => {
                e.preventDefault();
                if (!text) return;
                event.sendMessage({ to, from, channel, createdAt: Date.now(), text })
                this.setState((ps: any) => ({ chats: [{ ughId: from, text, createdAt: Date.now() }, ...ps.chats], text: "" }));
            }}>
                <input onChange={(e) => {
                    this.setState({ text: e.currentTarget.value })
                }} type="text" className="messenger__input" placeholder="Enter text and hit Enter" value={text} />
            </form>
        </div>
    }
}

export default MessengerChat