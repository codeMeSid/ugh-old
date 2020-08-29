import Link from 'next/link';
import Tooltip from '../tooltip';

const NavlinkIcon = ({ Icon, href, title }) => <Link href={href}>
    <a className="navbar--link">
        <Tooltip title={title}>
            <Icon className="navbar--icon" />
        </Tooltip>
    </a>
</Link >


export default NavlinkIcon;