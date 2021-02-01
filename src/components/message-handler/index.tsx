import { Component, useEffect, useState } from "react";
import Message from "./message";

interface MHProps {
  messages: Array<{
    message: string;
    type: string;
  }>;
}

const MessageHandler = ({ messages = [] }: { messages?: Array<any> }) => {
  const [ms, setMs] = useState(messages);

  useEffect(() => {
    if (JSON.stringify(ms) !== JSON.stringify(messages)) setMs(messages);
  }, [messages]);

  const onClickHandler = (i: number) =>
    setMs(ms.filter((it, index) => index !== i));

  return (
    <div className="message_handler">
      {ms.map(({ message, type }, index) => (
        <Message
          key={Math.random()}
          text={message}
          type={type}
          onClick={() => onClickHandler(index)}
        />
      ))}
    </div>
  );
};

export default MessageHandler;
