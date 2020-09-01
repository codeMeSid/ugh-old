import Link from "next/link";

const outerMenuLinks = (currentUser): Array<string> => [
    "home",
    "shop",
    "tournaments",
    "streams",
    ...(currentUser
        ? [
            "profile",
            "withdraw",
            "my-tournament",
            "signout",
        ]
        : [
            "sponsors",
            "about",
            "how-to-play",
            "signin",
            "signup"
        ])
];

const OuterMenu = ({ currentUser }) => <div className="navbar__responsive-menu">
    {
        outerMenuLinks(currentUser).map(link => {
            return <Link href={`/${link}`}>
                <a className="navbar__responsive-menu__link">{link}</a>
            </Link>
        })
    }
</div>

export default OuterMenu;