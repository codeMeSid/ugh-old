import React from "react";
import StoreNav from "../navbar/storenav";

const StoreLayout = ({
  currentUser,
  children,
}: {
  currentUser?: any;
  children: any;
}) => {
  return (
    <div className="store">
      <StoreNav currentUser={currentUser} />
      <div className="store__body">{children}</div>
    </div>
  );
};

export default StoreLayout;
