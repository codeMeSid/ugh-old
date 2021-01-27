import React, { useState, useEffect } from "react";
import SideLayout from "../../../components/layout/sidelayout";
import Table from "../../../components/table";
import { useRequest } from "../../../hooks/use-request";
import { SponsorshipDoc } from "../../../../server/models/sponsorship";
import Switch from "react-switch";
import Link from "next/link";
import Button from "../../../components/button/main";
import Router from "next/router";
import { AiFillDelete } from "react-icons/ai";
import IconDialogButton from "../../../components/button/icon-dialog";

const AdminSponsorshipDashboard = ({ currentUser }) => {
  const [sData, setSData] = useState([]);
  const [messages, setMessages] = useState([]);
  const SwitchBlade = (id: string, activity: boolean) => {
    return <Switch checked={activity} onChange={() => changeSActivity(id)} />;
  };
  const TableLink = (name: string, id: string) => (
    <Link href={`/admin/sponsorships/${id}`}>
      <a className="table__link">{name}</a>
    </Link>
  );
  const { doRequest } = useRequest({
    url: "/api/ugh/sponsorship/fetch/all",
    body: {},
    method: "get",
    onSuccess: (data: Array<SponsorshipDoc>) => {
      setSData(
        data.map((s) => [
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                height: 50,
                width: 50,
                backgroundColor: s.color,
                marginRight: 10,
              }}
            />
            <div>{TableLink(s.name.toUpperCase(), s.id)}</div>
          </div>,
          <ul>
            {s.packs.map((pack) => (
              <ol key={Math.random() * 9} style={{ marginTop: 5 }}>
                {pack.duration} Months - &#8377;{pack.price}
              </ol>
            ))}
          </ul>,
          SwitchBlade(s.id, s.isActive),
          <IconDialogButton
            Icon={AiFillDelete}
            iconStyle={{ color: "red", fontSize: 24 }}
            style={{ width: 300 }}
            onAction={(onSuccess, onError) => {
              const { doRequest: deleteUser } = useRequest({
                url: `/api/ugh/admin/delete/sponsorship/${s.id}`,
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
  useEffect(() => {
    doRequest();
  }, []);
  const changeSActivity = async (id: string) => {
    const { doRequest: updateSRequest } = useRequest({
      url: `/api/ugh/sponsorship/update/activity/${id}`,
      method: "put",
      body: {},
      onSuccess: () =>
        setMessages([{ message: "Successfully updated", type: "success" }]),
      onError: (errors) => setMessages(errors),
    });
    await updateSRequest();
    await doRequest();
  };

  return (
    <SideLayout
      currentUser={currentUser}
      messages={messages}
      title={`packs(${sData.length})`}
    >
      <Link href="/admin/sponsorships/add">
        <a style={{ marginBottom: 20 }}>
          <Button text="Add Pack" />
        </a>
      </Link>
      <Table
        headers={[
          { text: "name", isResponsive: false },
          { text: "packs", isResponsive: false },
          { text: "activity", isResponsive: false },
          { text: "delete", isResponsive: true },
        ]}
        data={sData}
      />
    </SideLayout>
  );
};

export default AdminSponsorshipDashboard;
