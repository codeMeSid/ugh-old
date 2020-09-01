import { useState } from 'react'
import Button from "../button/main"
import { AiOutlineMenu } from 'react-icons/ai';
import OuterMenu from './outer-menu';
const ResponsiveMenu = ({ currentUser }) => {
    const [openMenu, setOpenMenu] = useState(false);
    return <div className="navbar__list--responsive">
        <Button onPress={(_, next) => {
            setOpenMenu(!openMenu);
        }} type="icon" text={<AiOutlineMenu color="white" />} />
        {
            openMenu && <OuterMenu currentUser={currentUser} />
        }
    </div>
}

export default ResponsiveMenu;