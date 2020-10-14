import React, { Component, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import MessengerChat from "./chat";
import { SiGooglemessages } from 'react-icons/si';
import { event } from "../../socket";
import { SocketChannel } from "../../../server/utils/enum/socket-channel";

const UserProfile = require("../../public/asset/user.svg");

interface Props {
    from: string;
    chats: Array<{ to: string; channel: string; profile?: string; title: string }>;
}

class MessengerList extends Component<Props> {
    state = {
        messengers: this.formatChat(this.props.chats),
        chat: this.formatChat(this.props.chats)[0],
        isOpen: false,
        isContactOpen: true
    }

    constructor(props) {
        super(props);
        this.openChatHandler = this.openChatHandler.bind(this);
    }

    componentDidMount() {
        event.recieveMessage((data) => {
            const { messengers, chat } = this.state
            const { from } = this.props
            const uMessengers = messengers.map(messenger => {
                const { to, channel } = messenger;
                switch (channel) {
                    case SocketChannel.Admin:
                        if (data.from === "admin" && chat.to !== "admin" && data.from === to && data.to === from) messenger.count += 1;
                        else if (data.to === "admin" && chat.to !== data.from && data.from === to) messenger.count += 1;
                        break;
                    case SocketChannel.Match:
                        if (chat.to !== data.to && data.to === to && data.from !== this.props.from) messenger.count += 1
                        break;
                    case SocketChannel.User:
                        if (data.to === from && chat.to !== data.from) messenger.count += 1;
                        break;
                }
                return messenger;
            });
            this.setState({ messengers: uMessengers.sort((a, b) => b.count - a.count) })
        });
    }

    componentDidUpdate(prevProps: Props) {
        const { chats } = prevProps;
        if (JSON.stringify(chats) !== JSON.stringify(this.props.chats)) this.setState({ messengers: this.formatChat(this.props.chats), chat: this.formatChat(this.props.chats)[0] })
    }

    formatChat(chats: Array<any>) {
        return chats.map(chat => ({ ...chat, count: 10 }))
    }

    openChatHandler(index: number) {
        const uMessengers = Array.from(this.state.messengers).map((m, i) => {
            if (index === i) m.count = 0;
            return m;
        })
        this.setState({ chat: uMessengers[index], messengers: uMessengers });
    }

    render() {
        const { isContactOpen, isOpen, chat, messengers } = this.state;
        const { from } = this.props;
        return !isOpen ? <>
            <div className="messenger__window" onClick={() => this.setState({ isOpen: true })}>
                <SiGooglemessages className="messenger__window__icon" />
            </div>
        </>
            : <>
                <div className={`messenger__contact ${isContactOpen ? "active" : ""}`}>
                    <div className="messenger__contact__head">
                        <GiHamburgerMenu className="messenger__contact__head__icon" onClick={() => this.setState((ps: any) => ({ isContactOpen: !ps.isContactOpen }))} />
                        <span className="messenger__contact__head__title">contact</span>
                    </div>
                    <div className="messenger__contact__list">
                        {
                            messengers.map((chat, index) => {
                                return <div
                                    key={Math.random()}
                                    onClick={() => this.openChatHandler(index)}
                                    className="messenger__contact__item">
                                    <div className="messenger__contact__item__head" style={{ backgroundImage: `url(${chat?.profile || UserProfile})` }} >
                                        {chat.count > 0 && <div className="messenger__contact__item__head__count">{chat.count}</div>}
                                    </div>
                                    <div className="messenger__contact__item__title">{chat.title}</div>
                                </div>
                            })
                        }
                    </div>
                </div>
                <MessengerChat
                    onClose={() => this.setState({ isOpen: false })}
                    onOpenMenu={() => this.setState((ps: any) => ({ isContactOpen: !ps.isContactOpen }))}
                    from={from}
                    to={chat?.to}
                    channel={chat?.channel}
                    profile={chat?.profile || UserProfile}
                    title={chat?.title}
                />
            </>
    }
}


export default MessengerList;