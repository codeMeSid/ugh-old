import Link from "next/link";
import SideNavbar from "../navbar/sidenav";
import Button from "../button/main";
import MessageHandler from "../message-handler";
import React, { Component, useEffect, useState } from "react";
import { useRequest } from "../../hooks/use-request";
import MessengerList from "../messenger";

const SideLayout = ({
  messages = [],
  title = "",
  currentUser,
  children,
}: {
  title: string;
  currentUser?: any;
  children?: any;
  messages?: Array<any>;
}) => {
  const [chats, setChats] = useState([]);
  const [messageHandles, setMessageHandles] = useState(messages);
  const { doRequest } = useRequest({
    url: "/api/ugh/user/fetch/all/messenger",
    body: {},
    method: "get",
    onSuccess: (data) => {
      setChats(
        data
          ?.map((user: any) => {
            return {
              to: user.ughId,
              channel: "admin",
              profile: user?.uploadUrl,
              title: user.ughId,
            };
          })
          .filter((chat: any) => chat.to !== currentUser?.ughId)
      );
    },
    onError: (err) => {},
  });
  useEffect(() => {
    doRequest();
  }, []);
  useEffect(() => {
    if (messages.length !== 0) setMessageHandles(messages);
  }, [messages]);
  return (
    <>
      <div className="layout layout--side">
        <SideNavbar />
        <div className="layout layout__body">
          <div className="layout__body__title">
            <div className="layout__body__title__text">{title}</div>
            <Link href="/">
              <a>
                <Button text="Go To Site" />
              </a>
            </Link>
          </div>
          <div className="layout__body__children">
            {children}
            <MessengerList
              from="admin"
              currentUser={currentUser}
              chats={chats}
            />
            {/* <div className="layout__body__children__fab"></div> */}
          </div>
        </div>
      </div>
      <MessageHandler messages={messageHandles} />
    </>
  );
};

export default SideLayout;
