import React, { useState, useEffect } from "react";
import SideLayout from "../../../components/layout/sidelayout";
import Table from "../../../components/table";
import { useRequest } from "../../../hooks/use-request";
import { UserDoc } from "../../../../server/models/user";
import Switch from "react-switch";
import Link from "next/link";
import Router from "next/router";
import { AiFillDelete } from "react-icons/ai";
import IconDialogButton from "../../../components/button/icon-dialog";

const AdminUserDashboard = ({ currentUser }) => {
  // state
  const [userData, setUserData] = useState([]);
  const [messages, setMessages] = useState([]);
  // components
  const SwitchBlade = (id: string, activity: string) =>
    activity === "inactive" ? (
      <div style={{ color: "red", textTransform: "uppercase" }}>Unverified</div>
    ) : (
      <div>
        <div style={{ color: "blue", textTransform: "uppercase" }}>
          {activity}
        </div>
        <Switch
          onChange={() => changeUserActivity(id)}
          checked={activity === "active"}
        />
      </div>
    );
  const TableLink = (name: string, id: string) => (
    <Link href={`/admin/users/${id}`}>
      <a className="table__link">{name}</a>
    </Link>
  );
  // requests
  const { doRequest } = useRequest({
    url: "/api/ugh/user/fetch/all",
    body: {},
    method: "get",
    onSuccess: (data: Array<UserDoc>) =>
      setUserData(
        data.map((user) => {
          return [
            TableLink(user.ughId, user.id),
            user.name,
            user.email,
            user.wallet.coins,
            SwitchBlade(user.id, user.activity),
            <IconDialogButton
              Icon={AiFillDelete}
              iconStyle={{ color: "red", fontSize: 24 }}
              style={{ width: 300, position: "fixed" }}
              onAction={(onSuccess, onError) => {
                const { doRequest: deleteUser } = useRequest({
                  url: `/api/ugh/admin/delete/user/${user.id}`,
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
          ];
        })
      ),
    onError: (errors) => setMessages(errors),
  });
  // effects
  useEffect(() => {
    doRequest();
  }, []);
  // methods
  const changeUserActivity = async (id: string) => {
    const { doRequest: updateUserRequest } = useRequest({
      url: `/api/ugh/user/activity/${id}`,
      method: "put",
      body: {},
      onSuccess: () =>
        setMessages([
          { message: "User updated successfully", type: "success" },
        ]),
      onError: (errors) => setMessages(errors),
    });
    await updateUserRequest();
    await doRequest();
  };
  // render
  return (
    <SideLayout
      currentUser={currentUser}
      messages={messages}
      title={`users(${userData.length})`}
    >
      <Table
        headers={[
          { text: "ughId", isResponsive: false },
          { text: "name", isResponsive: true },
          { text: "email", isResponsive: true },
          { text: "coins", isResponsive: false },
          { text: "status", isResponsive: false },
          { text: "delete", isResponsive: true },
        ]}
        data={userData}
      />
    </SideLayout>
  );
};

export default AdminUserDashboard;
