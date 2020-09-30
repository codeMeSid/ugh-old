import Link from 'next/link';
import Tooltip from '../tooltip';

const NavlinkIcon = ({ Icon, href, title }) => <Link href={href}>
    <a className="navbar--side--link">
        <Icon className="navbar--side--link__icon" />
        <div className="navbar--side--link__title">{title}</div>
    </a>
</Link >


export default NavlinkIcon;