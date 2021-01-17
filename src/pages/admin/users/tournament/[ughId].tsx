import { format } from "date-fns";
import React, { useRef, useState } from "react";
import { GiSkullCrossedBones } from "react-icons/gi";
import { GrCheckmark } from "react-icons/gr";
import IconDialogButton from "../../../../components/button/icon-dialog";
import Input from "../../../../components/input/input";
import SideLayout from "../../../../components/layout/sidelayout";
import Table from "../../../../components/table";
import { serverRequest } from "../../../../hooks/server-request";
import { useRequest } from "../../../../hooks/use-request";
import Router from "next/router";
import { TiTick } from "react-icons/ti";
import { AiFillDelete } from "react-icons/ai";
import DialogButton from "../../../../components/button/dialog";

const AdminTournamentPage = ({ tournaments, errors, ughId }) => {
  let winning = 0;
  const [messages, setMessages] = useState(errors || []);

  const { doRequest } = useRequest({
    url: "/api/ugh/user/update/tournament",
    body: {},
    method: "put",
    onSuccess: Router.reload,
    onError: (errors) => setMessages(errors),
  });

  return (
    <SideLayout title="tournaments" messages={messages}>
      <h1 style={{ textAlign: "center", fontWeight: 600, fontSize: 36 }}>
        {ughId}
      </h1>
      <Table
        headers={[
          { text: "date", isResponsive: true },
          { text: "tournament", isResponsive: false },
          { text: "game", isResponsive: true },
          { text: "status", isResponsive: false },
          { text: "delete", isResponsive: true },
        ]}
        data={tournaments.map((t: any) => {
          const canStatusChange =
            Date.now() < new Date(t?.endDateTime || Date.now()).valueOf();
          return [
            format(
              new Date(t?.startDateTime || Date.now()),
              "dd/MM/yyy hh:mm a"
            ),
            t.name,
            t?.game,
            t.didWin ? (
              <IconDialogButton
                Icon={TiTick}
                iconStyle={{ color: "green", fontSize: 30 }}
                style={{ width: 300 }}
                onAction={(onSuccess, onError) => {
                  const { doRequest: wonTournamentRequest } = useRequest({
                    url: `/api/ugh/admin/update/user/tournament/${ughId}/${t.id}`,
                    method: "put",
                    body: {},
                    onSuccess: Router.reload,
                    onError: setMessages,
                  });
                  wonTournamentRequest(onSuccess, onError);
                }}
              >
                <div style={{ margin: 10, fontSize: 18 }}>
                  Are you Sure? Change it to loss?
                </div>
              </IconDialogButton>
            ) : canStatusChange ? (
              <div style={{ color: "blue", fontWeight: 900, fontSize: 20 }}>
                TBD
              </div>
            ) : (
              <IconDialogButton
                Icon={GiSkullCrossedBones}
                iconStyle={{ color: "red", fontSize: 30 }}
                onAction={(onSuccess, onError) => {
                  if (winning < 10) {
                    onError([]);
                    return setMessages([
                      { message: "Minimum Winnings 10 UGH coins." },
                    ]);
                  }
                  doRequest(onSuccess, onError, { winning, id: t.id, ughId });
                }}
              >
                <Input
                  placeholder="Winning Amount"
                  type="number"
                  onChange={(n, v) => {
                    winning = v;
                  }}
                />
              </IconDialogButton>
            ),
            <IconDialogButton
              Icon={AiFillDelete}
              iconStyle={{ color: "red", fontSize: 24 }}
              style={{ width: 300 }}
              onAction={(onSuccess, onError) => {
                const { doRequest: deleteUser } = useRequest({
                  url: `/api/ugh/admin/remove/user/tournament/${ughId}/${t.id}`,
                  method: "put",
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
        })}
      />
    </SideLayout>
  );
};

AdminTournamentPage.getInitialProps = async (ctx: any) => {
  const { ughId } = ctx.query;
  const { data, errors } = await serverRequest(ctx, {
    url: `/api/ugh/tournament/user/fetch/${ughId}`,
    body: {},
    method: "get",
  });
  return { tournaments: data || [], errors: errors || [], ughId };
};

export default AdminTournamentPage;
