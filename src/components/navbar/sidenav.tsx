import NavlinkIcon from "./navlink-icon";
import { GoBook, GoHome } from "react-icons/go";
import {
  RiGalleryLine,
  RiGameLine,
  RiUser5Line,
  RiGamepadLine,
  RiSteamFill,
  RiBitCoinLine,
  RiBankLine,
  RiLifebuoyLine,
  RiSettings3Line,
} from "react-icons/ri";
import { VscDebugConsole } from "react-icons/vsc";
import { BsPeople, BsNewspaper, BsListCheck } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { GiCrossedSwords } from "react-icons/gi";
import { Component, useEffect, useState } from "react";
import { event } from "../../socket";
import { SocketChannel } from "../../../server/utils/enum/socket-channel";
import { useRequest } from "../../hooks/use-request";

class SideNavbar extends Component {
  state = {
    tn: 0,
    dn: 0,
  };
  componentDidMount() {
    const { doRequest } = useRequest({
      url: "/api/ugh/admin/fetch/notificaton",
      body: {},
      method: "get",
      onSuccess: (data) => this.setState(data),
      onError: (err) => {},
    });
    doRequest();
    event.recieveMessage(({ type, channel }) => {
      if (channel === SocketChannel.BracketRank && type === "dispute")
        doRequest();
    });
  }
  render() {
    const { tn, dn } = this.state;
    return (
      <>
        <div className="navbar navbar--side">
          <div
            style={{
              marginTop: 5,
              marginBottom: 5,
              fontSize: 20,
              color: "white",
            }}
          >
            UGH
          </div>
          <NavlinkIcon Icon={GoHome} href="/admin" title="home" />
          <NavlinkIcon Icon={RiUser5Line} href="/admin/users" title="users" />
          {/* 
           
            <NavlinkIcon
              Icon={AiOutlineMessage}
              href="/admin/messages"
              title="messages"
            />
          </div> */}
          <NavlinkIcon
            Icon={BsListCheck}
            href="/admin/categorys"
            title="category"
          />
          <NavlinkIcon Icon={RiBitCoinLine} href="/admin/coins" title="coins" />
          <NavlinkIcon Icon={GoBook} href="/admin/passbook" title="passbook" />
          <NavlinkIcon
            Icon={VscDebugConsole}
            href="/admin/consoles"
            title="consoles"
          />
          <NavlinkIcon Icon={RiGameLine} href="/admin/games" title="games" />
          <NavlinkIcon
            Icon={RiGamepadLine}
            href="/admin/tournaments"
            title="tournaments"
          />
          <div style={{ position: "relative" }}>
            {dn > 0 && <div className="navbar__count">{dn}</div>}
            <NavlinkIcon
              Icon={GiCrossedSwords}
              href="/admin/disputes"
              title="disputes"
            />
          </div>
          <div style={{ position: "relative" }}>
            {tn > 0 && <div className="navbar__count">{tn}</div>}
            <NavlinkIcon
              Icon={RiBankLine}
              href="/admin/transactions"
              title="transactions"
            />
          </div>
          <NavlinkIcon
            Icon={RiSettings3Line}
            href="/admin/settings"
            title="settings"
          />
          <NavlinkIcon
            Icon={RiLifebuoyLine}
            href="/admin/sponsorships"
            title="sponsorships"
          />
          <NavlinkIcon
            Icon={BsPeople}
            href="/admin/sponsors"
            title="sponsors"
          />
          <NavlinkIcon
            Icon={RiSteamFill}
            href="/admin/streams"
            title="streams"
          />
          <NavlinkIcon Icon={BsNewspaper} href="/admin/news" title="news" />
          <NavlinkIcon
            Icon={RiGalleryLine}
            href="/admin/gallery"
            title="gallery"
          />
        </div>
        <div style={{ width: "5rem" }} />
      </>
    );
  }
}

export default SideNavbar;
