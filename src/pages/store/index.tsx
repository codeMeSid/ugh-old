import React from "react";
import MainLayout from "../../components/layout/mainlayout";
import StoreLayout from "../../components/layout/storelayout";

const StorePage = ({ currentUser }) => {
  return (
    <MainLayout>
      <StoreLayout currentUser={currentUser}>
        <div></div>
      </StoreLayout>
    </MainLayout>
  );
};

export default StorePage;
