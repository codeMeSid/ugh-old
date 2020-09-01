import Link from "next/link";
import DropdownMenu from "./dropdown-menu";
import { navlinks, navlinksAuth, profileMenuLinks, moreMenuLinks } from "../../public/resource";



const CollapseMenu = ({ currentUser }: { currentUser: any }) => {
    return <div className="navbar__list--collapse">
        {navlinks.map(link => {
            return <Link key={Math.random()} href={`/${link}`}>
                <a className="navbar__item--link">{link}</a>
            </Link>
        })}
        {
            !currentUser && navlinksAuth.map(link => {
                return <Link key={Math.random()} href={`/${link}`}>
                    <a className="navbar__item--link">{link}</a>
                </Link>
            })
        }
        {currentUser && <DropdownMenu title="account" listItems={profileMenuLinks} />}
        <DropdownMenu title="more" listItems={moreMenuLinks} />
    </div>
};



export default CollapseMenu;