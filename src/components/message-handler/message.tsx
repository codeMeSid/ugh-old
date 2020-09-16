import React from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { MdClose } from 'react-icons/md'

const Message = ({ text, onClick, type = "error" }) => {


    const Icon = () => {
        switch (type) {
            case 'error': return <AiOutlineWarning />;
            case 'success': return <TiTick />
        }
    }


    return <div className={`message_handler__message message_handler__message--${type}`}>
        <div className="message_handler__message__icon">{Icon()}</div>
        <div className="message_handler__message__text">{text}</div>
        <div className="message_handler__message__close"><MdClose onClick={onClick} /></div>
    </div>
}

export default Message;