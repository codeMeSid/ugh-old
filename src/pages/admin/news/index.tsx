import React, { useState, useEffect } from "react";
import SideLayout from "../../../components/layout/sidelayout";
import Table from "../../../components/table";
import { useRequest } from "../../../hooks/use-request";
import { NewsDoc } from "../../../../server/models/news";
import Switch from "react-switch";
import Link from "next/link";
import Button from "../../../components/button/main";
import Router from "next/router";
import { AiFillDelete } from "react-icons/ai";
import IconDialogButton from "../../../components/button/icon-dialog";

const AdminNewsDashboard = () => {
  const [newsData, setNewsData] = useState([]);

  const [messages, setMessages] = useState([]);
  const SwitchBlade = (id: string, activity: boolean) => {
    return (
      <Switch checked={activity} onChange={() => changeNewsActivity(id)} />
    );
  };
  const { doRequest } = useRequest({
    url: "/api/ugh/news/fetch/all",
    body: {},
    method: "get",
    onSuccess: (data: Array<NewsDoc>) =>
      setNewsData(
        data.map((news) => [
          news.title,
          <a href={news?.uploadUrl || ""} target="_blank">
            <img className="gallery__image" src={news?.uploadUrl || ""} />
          </a>,
          SwitchBlade(news.id, news.isActive),
          <IconDialogButton
            Icon={AiFillDelete}
            iconStyle={{ color: "red", fontSize: 24 }}
            style={{ width: 300 }}
            onAction={(onSuccess, onError) => {
              const { doRequest: deleteUser } = useRequest({
                url: `/api/ugh/admin/delete/news/${news.id}`,
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
      ),
    onError: (errors) => setMessages(errors),
  });

  useEffect(() => {
    doRequest();
  }, []);

  const changeNewsActivity = async (id: string) => {
    const { doRequest: updateNewsRequest } = useRequest({
      url: `/api/ugh/news/update/activity/${id}`,
      method: "put",
      body: {},
      onSuccess: () =>
        setMessages([{ message: "Updated successfully", type: "success" }]),
      onError: (errors) => setMessages(errors),
    });
    await updateNewsRequest();
    await doRequest();
  };
  return (
    <SideLayout messages={messages} title={`news(${newsData.length})`}>
      <Link href="/admin/news/add">
        <a>
          <Button text="Add News" />
        </a>
      </Link>
      <Table
        headers={[
          {
            text: "title",
            isResponsive: false,
          },
          {
            text: "image",
            isResponsive: false,
          },
          {
            text: "activity",
            isResponsive: false,
          },
          { text: "delete", isResponsive: true },
        ]}
        data={newsData}
      />
    </SideLayout>
  );
};

export default AdminNewsDashboard;
