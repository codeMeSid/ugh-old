import React from "react";
import StoreNav from "../navbar/storenav";
import MainLayout from "./mainlayout";

const StoreLayout = ({
  currentUser,
  children,
}: {
  currentUser?: any;
  children: any;
}) => {
  return (
    <MainLayout>
      <div className="store">
        <StoreNav currentUser={currentUser} />
        <div className="store__body">{children}</div>
      </div>
    </MainLayout>
  );
};

export default StoreLayout;
