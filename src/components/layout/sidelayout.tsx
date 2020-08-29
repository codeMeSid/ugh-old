import Link from 'next/link';
import SideNavbar from "../navbar/sidenav"
import Button from "../button";

const SideLayout = ({ children, title }) => {

    return <div className="layout layout--side">
        <SideNavbar />
        <div className="layout layout__body">
            <div className="layout__body__title">
                <div className="layout__body__title__text">{title}</div>
                <Link href="/">
                    <a>
                        <Button text="Go To Site" />
                    </a>
                </Link>
            </div>
            <div className="layout__body__children">
                {children}
                <div className="layout__body__children__fab">
                   
                </div>
            </div>
        </div>
    </div>
}

export default SideLayout;