import { useState } from 'react'
import Button from "../button/main"
import { AiOutlineMenu } from 'react-icons/ai';
import OuterMenu from './outer-menu';
const ResponsiveMenu = ({ currentUser }) => {
    const [openMenu, setOpenMenu] = useState(false);

    const onClick = () => setOpenMenu(false);

    return <div className="navbar__list--responsive">
        <Button onPress={() => {
            setOpenMenu(!openMenu);
        }} type="icon" text={<AiOutlineMenu color="white" />} />
        {
            openMenu && <OuterMenu onClick={onClick} currentUser={currentUser} />
        }
    </div>
}

export default ResponsiveMenu;