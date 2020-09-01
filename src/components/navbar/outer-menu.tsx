import Link from "next/link";
import { outerMenuLinks } from "../../public/resource";


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