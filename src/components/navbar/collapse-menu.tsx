import Link from "next/link";
import DropdownMenu from "./dropdown-menu";

const profileMenu = [
    "profile",
    "my-tournament",
    "withdraw",
    "settings",
    "logout",
];
const moreMenu = [
    "gallery",
    "streams",
    "sponsors",
    "how-to-play",
    "about",
];

const CollapseMenu = ({ currentUser }: { currentUser: any }) => {
    const navlinks = ["tournaments", "shop", ...(currentUser ? [] : ["signin", "signup"])];
    return <div className="navbar__list--collapse">
        {navlinks.map(link => {
            return <Link key={Math.random()} href={`/${link}`}>
                <a className="navbar__item--link">{link}</a>
            </Link>
        })}
        {currentUser && <DropdownMenu title="profile" listItems={profileMenu} />}
        <DropdownMenu title="more" listItems={moreMenu} />
    </div>
};



export default CollapseMenu;