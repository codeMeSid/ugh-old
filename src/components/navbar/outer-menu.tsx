import Link from "next/link";
import { outerMenuLinks, outerMenuLinksAuth, outerMenuLinksNonAuth } from "../../public/resource";


const OuterMenu = ({ currentUser }) => <div className="navbar__responsive-menu">
    {
        outerMenuLinks.map(link => {
            return <Link href={`/${link}`}>
                <a className="navbar__responsive-menu__link">{link}</a>
            </Link>
        })
    }
    {
        currentUser ? outerMenuLinksAuth.map(link => {
            return <Link href={`/${link}`}>
                <a className="navbar__responsive-menu__link">{link}</a>
            </Link>
        }) :
            outerMenuLinksNonAuth.map(link => {
                return <Link href={`/${link}`}>
                    <a className="navbar__responsive-menu__link">{link}</a>
                </Link>
            })
    }
</div>

export default OuterMenu;