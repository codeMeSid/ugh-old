import Link from "next/link";
import {
  outerMenuLinks,
  outerMenuLinksAuth,
  outerMenuLinksNonAuth,
} from "../../public/resource";

const OuterMenu = ({ currentUser, onClick }) => (
  <div className="navbar__responsive-menu">
    {outerMenuLinks.map((link) => {
      const splitText = link.split("-");
      const show = splitText.join(" ");
      return (
        <Link key={link} href={`/${link}`}>
          <a onClick={onClick} className="navbar__responsive-menu__link">
            {show}
          </a>
        </Link>
      );
    })}
    {currentUser && currentUser.role === "admin" && (
      <Link key={1} href={`/admin`}>
        <a onClick={onClick} className="navbar__responsive-menu__link">
          admin
        </a>
      </Link>
    )}
    {currentUser
      ? outerMenuLinksAuth.map((link) => {
          const splitText = link.split("-");
          const show = splitText.join(" ");
          return (
            <Link key={link} href={`/${link}`}>
              <a onClick={onClick} className="navbar__responsive-menu__link">
                {show}
              </a>
            </Link>
          );
        })
      : outerMenuLinksNonAuth.map((link) => {
          const splitText = link.split("-");
          const show = splitText.join(" ");
          return (
            <Link key={link} href={`/${link}`}>
              <a onClick={onClick} className="navbar__responsive-menu__link">
                {show}
              </a>
            </Link>
          );
        })}
  </div>
);

export default OuterMenu;
