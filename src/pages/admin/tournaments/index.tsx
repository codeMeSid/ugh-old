import React, { useState, useEffect } from "react";
import SideLayout from "../../../components/layout/sidelayout";
import Table from "../../../components/table";
import { useRequest } from "../../../hooks/use-request";
import { TournamentDoc } from "../../../../server/models/tournament";
import Link from "next/link";
import { format } from "date-fns";
import Button from "../../../components/button/main";
import ProgressButton from "../../../components/button/progress";
import Router from "next/router";
import { AiFillDelete } from "react-icons/ai";
import IconDialogButton from "../../../components/button/icon-dialog";

const AdminTournamentDashboard = () => {
  const [tData, setTData] = useState([]);
  const [messages, setMessages] = useState([]);
  const TableLink = (name: string, id: string) => (
    <Link href={`/admin/tournaments/${id}`}>
      <a className="table__link">{name}</a>
    </Link>
  );
  const EvaluateButton = (id: string) => (
    <ProgressButton
      text="Evaluate"
      type="secondary"
      onPress={(_, next) => {
        const { doRequest } = useRequest({
          url: `/api/ugh/tournament/evaluate/${id}`,
          body: {},
          method: "get",
        });
        doRequest();
        next();
      }}
    />
  );

  const { doRequest } = useRequest({
    url: "/api/ugh/tournament/fetch/all",
    body: {},
    method: "get",
    onSuccess: (data: Array<TournamentDoc>) => {
      setTData(
        data.map((t) => {
          return [
            TableLink(t?.name, t?.regId),
            `${t?.coins} coins`,
            format(new Date(t?.startDateTime), "dd/MM/yyyy hh:mm a"),
            `${t?.game?.name} (${t?.game?.console.toUpperCase()})`,
            <div>
              {t?.players?.length}/{t?.playerCount}
            </div>,
            t?.status?.toUpperCase(),
            !(Date.now() > new Date(t?.endDateTime).valueOf())
              ? "SOON"
              : t?.winners?.length > 0
              ? null
              : EvaluateButton(t?.regId),
            <IconDialogButton
              Icon={AiFillDelete}
              iconStyle={{ color: "red", fontSize: 24 }}
              style={{ width: 300 }}
              onAction={(onSuccess, onError) => {
                const { doRequest: deleteUser } = useRequest({
                  url: `/api/ugh/admin/delete/tournament/${t.id}`,
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
      );
    },
    onError: (errors) => setMessages(errors),
  });
  useEffect(() => {
    doRequest();
  }, []);

  return (
    <SideLayout messages={messages} title={`match(${tData.length})`}>
      <Link href="/admin/tournaments/add">
        <a style={{ marginBottom: 20 }}>
          <Button text="Add Tournament" />
        </a>
      </Link>
      <Table
        headers={[
          {
            text: "name",
            isResponsive: false,
          },
          {
            text: "entry coins",
            isResponsive: true,
          },
          {
            text: "start date",
            isResponsive: false,
          },
          {
            text: "game",
            isResponsive: false,
          },
          {
            text: "players",
            isResponsive: true,
          },
          {
            text: "status",
            isResponsive: false,
          },
          {
            text: "evaluate",
            isResponsive: false,
          },
          {
            text: "delete",
            isResponsive: true,
          },
        ]}
        data={tData}
      />
    </SideLayout>
  );
};

export default AdminTournamentDashboard;
