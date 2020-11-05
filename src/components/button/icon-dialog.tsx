import { useState } from 'react';
import Button from "./main";
import { GrClose } from 'react-icons/gr';
import ProgressButton from './progress';

const IconDialogButton = ({
    children,
    onAction,
    style = {},
    iconStyle = {},
    Icon, }: { Icon: any, children: any, onAction?: any, style?: any, iconStyle?: any }) => {
    const [openDialog, setOpenDialog] = useState(false);
    return <>
        <div style={{ display: "flex", alignItems: "center" }}>
            <Icon style={iconStyle} onClick={() => setOpenDialog(!openDialog)} />
        </div>
        {openDialog && <div className="dialog" style={style}>
            <div className="dialog__head">
                <GrClose onClick={() => setOpenDialog(false)} />
            </div>
            <div className="dialog__body" >
                {children}
            </div>
            {onAction && <div className="dialog__footer">
                <Button onPress={() => setOpenDialog(false)} style={{ marginRight: 10 }} type="link" text="cancel" />
                <ProgressButton type="primary" text="submit" onPress={async (_, next) => {
                    await onAction();
                    await next()
                    await setOpenDialog(false)
                }} />
            </div>}
        </div>}
    </>
}

export default IconDialogButton;