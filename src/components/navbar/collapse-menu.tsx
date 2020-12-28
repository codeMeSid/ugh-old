import Link from "next/link";
import DropdownMenu from "./dropdown-menu";
import {
  navlinks,
  navlinksAuth,
  profileMenuLinks,
  moreMenuLinks,
} from "../../public/resource";

const CollapseMenu = ({ currentUser }: { currentUser: any }) => {
  return (
    <div className="navbar__list--collapse">
      {navlinks.map((link) => {
        const splitText = link.split("-");
        const show = splitText.join(" ");
        return (
          <Link key={Math.random()} href={`/${link}`}>
            <a className="navbar__item--link">{show}</a>
          </Link>
        );
      })}
      {currentUser && currentUser.role === "admin" && (
        <Link key={Math.random()} href={`/admin`}>
          <a className="navbar__item--link">admin</a>
        </Link>
      )}
      {!currentUser &&
        navlinksAuth.map((link) => {
          const splitText = link.split("-");
          const show = splitText.join(" ");
          return (
            <Link key={Math.random()} href={`/${link}`}>
              <a className="navbar__item--link">{show}</a>
            </Link>
          );
        })}
      {currentUser && (
        <DropdownMenu title="account" listItems={profileMenuLinks} />
      )}
      <DropdownMenu title="more" listItems={moreMenuLinks} />
    </div>
  );
};

export default CollapseMenu;
