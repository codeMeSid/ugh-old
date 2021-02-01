import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CategoryDoc } from "../../../../server/models/category";
import Button from "../../../components/button/main";
import SideLayout from "../../../components/layout/sidelayout";
import Table from "../../../components/table";
import { useRequest } from "../../../hooks/use-request";
import Switch from "react-switch";
import IconDialogButton from "../../../components/button/icon-dialog";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";

const CategoryAdminPage = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const { doRequest: fetchHandler } = useRequest({
    url: "/api/ugh/category/fetch/all",
    body: {},
    method: "get",
    onSuccess: (data: Array<CategoryDoc>) =>
      setCategoryData(
        data.map((c) => {
          return [
            <Link href={`/admin/categorys/${c.id}`}>
              <a style={{ color: "blue" }}>{c.name}</a>
            </Link>,
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                maxHeight: 100,
              }}
            >
              {c.sub.map((s) => {
                console.log({ s });
                return <div key={Math.random()}>{s}</div>;
              })}
            </div>,
            <Switch
              checked={c.isActive}
              onChange={() => {
                const { doRequest } = useRequest({
                  url: `/api/ugh/category/update/activity/${c.id}`,
                  body: {},
                  method: "put",
                  onSuccess: () => fetchHandler(),
                  onError: (err) => setMessages(err),
                });
                doRequest();
              }}
            />,
            <IconDialogButton
              Icon={AiFillDelete}
              iconStyle={{ color: "red", fontSize: 24 }}
              style={{ width: 300 }}
              onAction={(onSuccess, onError) => {
                const { doRequest: deleteUser } = useRequest({
                  url: `/api/ugh/admin/delete/category/${c.id}`,
                  method: "delete",
                  body: {},
                  onSuccess: () => fetchHandler(),
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
    onError: (err) => setMessages(err),
  });
  useEffect(() => {
    fetchHandler();
  }, []);
  return (
    <SideLayout title="category" currentUser={currentUser} messages={messages}>
      <Link href="/admin/categorys/add">
        <a style={{ marginBottom: 20 }}>
          <Button text="Add Category" />
        </a>
      </Link>
      <Table
        headers={[
          { text: "name", isResponsive: false },
          { text: "sub-Category", isResponsive: true },
          { text: "is active", isResponsive: false },
          { text: "delete", isResponsive: true },
        ]}
        data={categoryData}
      />
    </SideLayout>
  );
};

export default CategoryAdminPage;
