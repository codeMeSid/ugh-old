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
import { BsPeople, BsNewspaper } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { GiCrossedSwords } from "react-icons/gi";
import { Component, useEffect, useState } from "react";
import { event } from "../../socket";
import { SocketChannel } from "../../../server/utils/enum/socket-channel";

class SideNavbar extends Component {
  state = {
    mNC: 0,
  };
  componentDidMount() {
    event.recieveMessage(({ to, channel }) => {
      if (channel === SocketChannel.Admin && to === "admin")
        this.setState((ps: any) => ({ mNC: ps.mNC + 1 }));
    });
  }
  render() {
    const { mNC } = this.state;
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
          <div
            style={{ position: "relative" }}
            onClick={() => this.setState({ mnc: 0 })}
          >
            {mNC > 0 && <div className="navbar__count">{mNC}</div>}
            <NavlinkIcon
              Icon={AiOutlineMessage}
              href="/admin/messages"
              title="messages"
            />
          </div>
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
          <NavlinkIcon
            Icon={GiCrossedSwords}
            href="/admin/disputes"
            title="disputes"
          />
          <NavlinkIcon
            Icon={RiBankLine}
            href="/admin/transactions"
            title="transactions"
          />
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
