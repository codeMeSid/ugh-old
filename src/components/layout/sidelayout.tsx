import Link from "next/link";
import SideNavbar from "../navbar/sidenav";
import Button from "../button/main";
import MessageHandler from "../message-handler";
import React, { Component } from "react";
import { useRequest } from "../../hooks/use-request";
import MessengerList from "../messenger";

interface Props {
  title: string;
  messages?: Array<any>;
  currentUser?: any;
}

class SideLayout extends Component<Props> {
  state = {
    chats: [],
  };
  componentDidMount() {
    const { doRequest } = useRequest({
      url: "/api/ugh/user/fetch/all/messenger",
      body: {},
      method: "get",
      onSuccess: (data) => {
        const { currentUser } = this.props;
        this.setState({
          chats: data
            ?.map((user: any) => {
              return {
                to: user.ughId,
                channel: "admin",
                profile: user?.uploadUrl,
                title: user.ughId,
              };
            })
            .filter((chat: any) => chat.to !== currentUser?.ughId),
        });
      },
      onError: (err) => {},
    });
    doRequest();
  }

  render() {
    const { chats } = this.state;
    const { title, children, currentUser, messages } = this.props;
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
        <MessageHandler messages={messages} />
      </>
    );
  }
}

export default SideLayout;
