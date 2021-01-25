import React, { useState, useEffect } from "react";
import SideLayout from "../../../components/layout/sidelayout";
import Table from "../../../components/table";
import { useRequest } from "../../../hooks/use-request";
import { TournamentDoc } from "../../../../server/models/tournament";
import Link from "next/link";
import { format, startOfWeek } from "date-fns";
import Button from "../../../components/button/main";
import ProgressButton from "../../../components/button/progress";
import Router from "next/router";
import { AiFillDelete } from "react-icons/ai";
import IconDialogButton from "../../../components/button/icon-dialog";
import XLSX from "xlsx";
import DialogButton from "../../../components/button/dialog";

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

  const generateReportHandler = (_: any, next: any) => {
    const { doRequest: reportGenerateRequest } = useRequest({
      url: "/api/ugh/tournament/generate/report",
      method: "get",
      body: {},
      onError: (err) => {
        setMessages(err);
        next(false, "Failed");
      },
      onSuccess: (data) => {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "UGH TRANSACTIONS");
        XLSX.writeFile(
          wb,
          `UGH_TOURNAMENT(${format(
            startOfWeek(new Date()),
            "dd/MM/yyyy"
          )}).xlsx`
        );
        next();
      },
    });
    reportGenerateRequest();
  };

  const generateReportNCleanHandler = (_: any, next: any) => {
    const { doRequest: cleanRequest } = useRequest({
      url: "/api/ugh/admin/clean/tournaments",
      body: {},
      method: "delete",
      onSuccess: Router.reload,
      onError: (err) => {
        setMessages(err);
        next(false, "Failed");
      },
    });
    const { doRequest: reportGenerateRequest } = useRequest({
      url: "/api/ugh/tournament/generate/report",
      method: "get",
      body: {},
      onError: (err) => {
        setMessages(err);
        next(false, "Failed");
      },
      onSuccess: (data) => {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "UGH TRANSACTIONS");
        XLSX.writeFile(
          wb,
          `UGH_TOURNAMENT(${format(
            startOfWeek(new Date()),
            "dd/MM/yyyy"
          )}).xlsx`
        );
        cleanRequest();
      },
    });
    reportGenerateRequest();
  };

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <SideLayout messages={messages} title={`match(${tData.length})`}>
      <div style={{ marginBottom: 10 }}>
        <Link href="/admin/tournaments/add">
          <a style={{ marginBottom: 20 }}>
            <Button text="Add Tournament" />
          </a>
        </Link>
        <ProgressButton
          style={{ marginLeft: 10 }}
          text="Generate Report"
          type="github"
          onPress={generateReportHandler}
        />
        <ProgressButton
          style={{ marginLeft: 10 }}
          text="Generate Report & Clean"
          type="youtube"
          onPress={generateReportNCleanHandler}
        />
      </div>
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
