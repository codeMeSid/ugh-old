import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import MessengerChat from "./chat";
import { SiGooglemessages } from 'react-icons/si';

const UserProfile = require("../../public/asset/user.svg");

const MessengerList = ({ from, chats = [] }) => {

    const [messengers] = useState(chats);
    const [mIndex, setMIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(true);

    return !isOpen ? <>
        <div className="messenger__window" onClick={() => setIsOpen(true)}>
            <SiGooglemessages className="messenger__window__icon" />
        </div>
    </>
        : <>
            <div className={`messenger__contact ${isContactOpen ? "active" : ""}`}>
                <div className="messenger__contact__head">
                    <GiHamburgerMenu className="messenger__contact__head__icon" onClick={() => setIsContactOpen(!isContactOpen)} />
                    <span className="messenger__contact__head__title">contact</span>
                </div>
                <div className="messenger__contact__list">
                    {
                        chats.map((chat, index) => {
                            return <div
                                key={Math.random()}
                                onClick={() => setMIndex(index)}
                                className="messenger__contact__item">
                                <div className="messenger__contact__item__head" style={{ backgroundImage: `url(${chat?.profile || UserProfile})` }} />
                                <div className="messenger__contact__item__title">{chat.title}</div>
                            </div>
                        })
                    }
                </div>
            </div>
            <MessengerChat
                onClose={() => setIsOpen(false)}
                onOpenMenu={() => setIsContactOpen(!isContactOpen)}
                from={from}
                to={messengers[mIndex].to}
                channel={messengers[mIndex].channel}
                profile={messengers[mIndex]?.profile}
                title={messengers[mIndex].title}
            />
        </>
}


export default MessengerList;