import { useState } from "react";
import Message from "./message";

const MessageHandler = ({ messageArray = [] }: { messageArray: Array<{ message: string, type?: string }> }) => {
    const [messages, setMessages] = useState(messageArray);
    const onClickHandler = (i: number) => {
        const updatedMessage = messages.filter((_, index) => i !== index);
        setMessages(updatedMessage);
    }
    return <div className="message_handler">
        {
            messages.map(({ message, type }, index) => <Message key={Math.random()} text={message} type={type} onClick={() => onClickHandler(index)} />)
        }
    </div>
}


export default MessageHandler;