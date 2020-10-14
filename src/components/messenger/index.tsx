import React, { Component, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import MessengerChat from "./chat";
import { SiGooglemessages } from 'react-icons/si';

const UserProfile = require("../../public/asset/user.svg");

interface Props {
    from: string;
    chats: Array<{ to: string; channel: string; profile?: string; title: string }>;
}

class MessengerList extends Component<Props> {
    state = {
        messengers: this.props.chats,
        mIndex: 0,
        isOpen: false,
        isContactOpen: true
    }

    componentDidUpdate(prevProps: Props) {
        const { chats } = prevProps;
        if (JSON.stringify(chats) !== JSON.stringify(this.props.chats)) this.setState({ messengers: chats, mIndex: 0 })
    }

    render() {
        const { isContactOpen, isOpen, mIndex, messengers } = this.state;
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
                                    onClick={() => this.setState({ mIndex: index })}
                                    className="messenger__contact__item">
                                    <div className="messenger__contact__item__head" style={{ backgroundImage: `url(${chat?.profile || UserProfile})` }} />
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
                    to={messengers[mIndex]?.to}
                    channel={messengers[mIndex]?.channel}
                    profile={messengers[mIndex]?.profile || UserProfile}
                    title={messengers[mIndex]?.title}
                />
            </>
    }
}


export default MessengerList;