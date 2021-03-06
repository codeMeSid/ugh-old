import React, { useState, useEffect } from "react";
import SideLayout from "../../components/layout/sidelayout";
import Table from "../../components/table";
import Button from "../../components/button/main";
import { useRequest } from "../../hooks/use-request";
import { GalleryDoc } from "../../../server/models/gallery";
import Switch from "react-switch";
import DialogButton from "../../components/button/dialog";
import Input from "../../components/input/input";
import FileInput from "../../components/input/file";
import Router from "next/router";
import { AiFillDelete } from "react-icons/ai";
import IconDialogButton from "../../components/button/icon-dialog";

const AdminGalleryDashboard = ({ currentUser }) => {
  // states
  const [galleryData, setGalleryData] = useState([]);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [messages, setMessages] = useState([]);
  // components
  const SwitchBlade = (id: string, activity: boolean) => {
    return (
      <Switch checked={activity} onChange={() => changeGalleryActivity(id)} />
    );
  };
  // requests
  const { doRequest } = useRequest({
    url: "/api/ugh/gallery/fetch/all",
    body: {},
    method: "get",
    onSuccess: (data: Array<GalleryDoc>) => {
      setGalleryData(
        data.map((gallery) => [
          gallery.name.toUpperCase(),
          <a href={gallery.imageUrl} target="_blank">
            <img className="gallery__image" src={gallery.imageUrl} />
          </a>,
          SwitchBlade(gallery.id, gallery.isActive),
          <IconDialogButton
            Icon={AiFillDelete}
            iconStyle={{ color: "red", fontSize: 24 }}
            style={{ width: 300 }}
            onAction={(onSuccess, onError) => {
              const { doRequest: deleteUser } = useRequest({
                url: `/api/ugh/admin/delete/gallery/${gallery.id}`,
                method: "delete",
                body: {},
                onSuccess: Router.reload,
                onError: setMessages,
              });
              deleteUser(onSuccess, onError);
            }}
          >
            <div style={{ margin: 10, fontSize: 18 }}>Are you Sure?</div>
          </IconDialogButton>,
        ])
      );
    },
    onError: (errors) => setMessages(errors),
  });
  const { doRequest: addGalleryRequest } = useRequest({
    url: "/api/ugh/gallery/add",
    body: {
      name,
      imageUrl,
    },
    method: "post",
    onSuccess: () => {
      setMessages([{ message: "Image added successfully", type: "success" }]);
      doRequest();
    },
    onError: (errors) => setMessages(errors),
  });
  // effect
  useEffect(() => {
    doRequest();
  }, []);
  // method
  const onChangeHandler = (name: string, value: string) => {
    switch (name) {
      case "name":
        return setName(value);
      case "imageUrl":
        return setImageUrl(value);
    }
  };
  const changeGalleryActivity = async (id: string) => {
    const { doRequest: updateGalleryRequest } = useRequest({
      url: `/api/ugh/gallery/update/activity/${id}`,
      method: "put",
      body: {},
      onSuccess: () =>
        setMessages([{ message: "Updated successfully", type: "success" }]),
      onError: (errors) => setMessages(errors),
    });
    await updateGalleryRequest();
    await doRequest();
  };
  // render
  return (
    <SideLayout
      currentUser={currentUser}
      messages={messages}
      title={`gallery(${galleryData.length})`}
    >
      <DialogButton title="add gallery" onAction={addGalleryRequest}>
        <Input name="name" placeholder="name" onChange={onChangeHandler} />
        <FileInput
          showImage
          name="imageUrl"
          placeholder="gallery image"
          onChange={onChangeHandler}
        />
      </DialogButton>
      <Table
        headers={[
          { text: "name", isResponsive: true },
          { text: "image", isResponsive: false },
          { text: "activity", isResponsive: false },
          { text: "delete", isResponsive: true },
        ]}
        data={galleryData}
      />
    </SideLayout>
  );
};

export default AdminGalleryDashboard;
