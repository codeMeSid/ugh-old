import { format } from "date-fns";
import React from "react";
import MainLayout from "../../../components/layout/mainlayout";
import Table from "../../../components/table";
import { serverRequest } from "../../../hooks/server-request";

const UserTournamentPage = ({ tournaments, errors }) => {
  return (
    <MainLayout messages={errors}>
      <div className="detail__bg">
        <div className="withdraw" style={{ backgroundColor: "#01071a" }}>
          <div
            style={{
              fontSize: 38,
              textAlign: "center",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Tournament History
          </div>
          <div
            style={{
              textAlign: "center",
              textTransform: "capitalize",
              fontWeight: "bold",
              fontSize: 24,
              color: "white",
              marginTop: 10,
            }}
          >
            wins & losses
          </div>
          <div className="withdraw__body">
            <Table
              hasPagination
              headers={[
                { text: "date", isResponsive: true },
                { text: "tournament", isResponsive: false },
                { text: "game", isResponsive: true },
                { text: "status", isResponsive: false },
              ]}
              data={tournaments?.map((t: any) => {
                const canStatusChange =
                  Date.now() < new Date(t?.endDateTime || Date.now()).valueOf();
                return [
                  format(
                    new Date(t?.startDateTime || Date.now()),
                    "dd/MM/yyy hh:mm a"
                  ),
                  t?.name,
                  t?.game,
                  <span style={{ fontWeight: 700 }}>
                    {t?.didWin ? (
                      <div style={{ color: "green" }}>WON</div>
                    ) : canStatusChange ? (
                      <div style={{ color: "blue" }}>TBD</div>
                    ) : (
                      <div style={{ color: "red" }}>LOST</div>
                    )}
                  </span>,
                ];
              })}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

UserTournamentPage.getInitialProps = async (ctx: any) => {
  const { ughId } = ctx.query;
  const { data, errors } = await serverRequest(ctx, {
    url: `/api/ugh/tournament/user/fetch/${ughId}`,
    body: {},
    method: "get",
  });
  return { tournaments: data || [], errors: errors || [] };
};

export default UserTournamentPage;
