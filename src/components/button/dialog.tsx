import { useState } from "react";
import Button from "./main";
import { GrClose } from "react-icons/gr";
import ProgressButton from "./progress";

const DialogButton = ({
  title,
  fullButton,
  children,
  onAction,
  style = {},
  size = "large",
  disabled,
  buttonStyle = {},
  buttonText = "Submit",
  type = "link",
}: {
  buttonStyle?: any;
  type?: string;
  size?: string;
  title: any;
  buttonText?: string;
  fullButton?: boolean;
  children: any;
  onAction?: (
    onSuccess: (data: any) => any,
    onError: (errors: any) => any
  ) => any;
  style?: any;
  disabled?: boolean;
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", ...buttonStyle }}>
        {fullButton ? (
          <>
            <Button
              disabled={disabled}
              text={title}
              size={size}
              type={type}
              onPress={() => setOpenDialog(!openDialog)}
            />
          </>
        ) : (
          <>
            <Button
              onPress={() => setOpenDialog(!openDialog)}
              size="icon"
              text="+"
              style={{ marginBottom: 10, marginRight: 10 }}
            />
            <h1 style={{ textTransform: "capitalize" }}>{title}</h1>
          </>
        )}
      </div>
      {openDialog && (
        <div className="dialog" style={style}>
          <div className="dialog__head">
            <GrClose onClick={() => setOpenDialog(false)} />
          </div>
          <div className="dialog__body">{children}</div>
          {onAction && (
            <div className="dialog__footer">
              <Button
                onPress={() => setOpenDialog(false)}
                style={{ marginRight: 10 }}
                type="link"
                text="cancel"
              />
              <ProgressButton
                type="primary"
                text={buttonText}
                onPress={(_, next) => {
                  onAction(
                    (data: any) => {
                      next();
                      setOpenDialog(false);
                    },
                    () => {
                      next(false, "Failed");
                    }
                  );
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DialogButton;
