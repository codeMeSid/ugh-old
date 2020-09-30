import NavlinkIcon from "./navlink-icon";
import { GoHome } from 'react-icons/go';
import { RiGalleryLine, RiGameLine, RiUser5Line, RiGamepadLine, RiSteamFill, RiBitCoinLine, RiBankLine, RiLifebuoyLine, RiSettings3Line } from 'react-icons/ri';
import { VscDebugConsole } from 'react-icons/vsc';
import { BsPeople, BsNewspaper } from 'react-icons/bs';
import { AiOutlineMessage } from 'react-icons/ai';
import { GiCrossedSwords } from 'react-icons/gi';

const SideNavbar = () => {
    return <>
        <div className="navbar navbar--side">
            <div style={{ marginTop: 5, marginBottom: 5, fontSize: 20, color: "white" }}>UGH</div>
            <NavlinkIcon Icon={GoHome} href="/admin" title="home" />
            <NavlinkIcon Icon={RiUser5Line} href="/admin/users" title="users" />
            <NavlinkIcon Icon={RiGamepadLine} href="/admin/tournaments" title="tournaments" />
            <NavlinkIcon Icon={RiBankLine} href="/admin/transactions" title="transactions" />
            <NavlinkIcon Icon={BsPeople} href="/admin/sponsors" title="sponsors" />
            <NavlinkIcon Icon={RiLifebuoyLine} href="/admin/sponsorships" title="sponsorships" />
            <NavlinkIcon Icon={RiSteamFill} href="/admin/streams" title="streams" />
            <NavlinkIcon Icon={RiBitCoinLine} href="/admin/coins" title="coins" />
            <NavlinkIcon Icon={VscDebugConsole} href="/admin/consoles" title="consoles" />
            <NavlinkIcon Icon={RiGameLine} href="/admin/games" title="games" />
            <NavlinkIcon Icon={BsNewspaper} href="/admin/news" title="news" />
            <NavlinkIcon Icon={RiGalleryLine} href="/admin/gallery" title="gallery" />
            <NavlinkIcon Icon={RiSettings3Line} href="/admin/settings" title="settings" />
            <NavlinkIcon Icon={AiOutlineMessage} href="/admin/messages" title="messages" />
            <NavlinkIcon Icon={GiCrossedSwords} href="/admin/disputes" title="disputes" />
        </div>
        <div style={{ width: "5rem" }} />
    </>
}


export default SideNavbar;