import Link from "next/link";
import CollapseMenu from "./collapse-menu";
import ResponsiveMenu from "./responsive-menu";

const Logo = require("../../public/asset/logo.png");

const TopNavbar = ({ currentUser }: { currentUser: any}) => {
    return <nav className="navbar navbar--top">
        <Link href="/">
            <a className="navbar__item">
                <img src={Logo} alt="ultimate gamershub logo" className="navbar__logo" />
            </a>
        </Link>
        <div className="navbar__list">
            <ResponsiveMenu />
            <CollapseMenu currentUser={currentUser} />
        </div>
    </nav>
}

export default TopNavbar;