import { useState } from 'react';
import Button from "./main";
import { GrClose } from 'react-icons/gr'
import ProgressButton from './progress';

const DialogButton = ({ title, children, onAction }) => {
    const [openDialog, setOpenDialog] = useState(false);
    return <>
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button onPress={() => setOpenDialog(!openDialog)} size="icon" text="+" style={{ marginBottom: 10, marginRight: 10 }} />
            <h1 style={{ textTransform: "capitalize" }}>{title}</h1>
        </div>
        {openDialog && <div className="dialog">
            <div className="dialog__head">
                <GrClose onClick={() => setOpenDialog(false)} />
            </div>
            <div className="dialog__body">
                {children}
            </div>
            <div className="dialog__footer">
                <Button onPress={() => setOpenDialog(false)} style={{ marginRight: 10 }} type="link" text="cancel" />
                <ProgressButton type="primary" text="submit" onPress={async (_, next) => {
                    await onAction();
                    await next()
                    await setOpenDialog(false)
                }} />
            </div>
        </div>}
    </>
}

export default DialogButton;