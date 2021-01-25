import { useState } from "react";
import Button from "./main";
import { GrClose } from "react-icons/gr";
import ProgressButton from "./progress";

const TextDialogButton = ({
  children,
  onAction,
  style = {},
  text,
  textClassName = "",
  buttonText = "Submit",
}: {
  text: any;
  textClassName?: string;
  buttonText?: string;
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
      <div
        className={textClassName}
        style={{ cursor: "pointer" }}
        onClick={() => setOpenDialog(true)}
      >
        {text}
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
                type="primary"
                text="cancel"
              />
              <ProgressButton
                type="link"
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

export default TextDialogButton;
