import { PassbookDoc } from "../../../server/models/passbook";
import SideLayout from "../../components/layout/sidelayout";
import Table from "../../components/table";
import { serverRequest } from "../../hooks/server-request";
import { format } from "date-fns";

const AdminPassbookPage = ({
  passbooks,
  errors,
  passbookMetrics,
}: {
  passbooks: Array<PassbookDoc>;
  passbookMetrics: any;
  errors: any;
}) => {
  return (
    <SideLayout messages={errors} title="Passbook">
      <div className="detail">
        <div className="row">
          <Table
            headers={[
              { text: "date", isResponsive: false },
              { text: "ughId", isResponsive: false },
              { text: "coins", isResponsive: false },
              { text: "event", isResponsive: true },
              { text: "source", isResponsive: true },
            ]}
            data={passbooks.map((p) => [
              format(new Date(p.date), "dd/MM/yyyy hh:mm a"),
              p.ughId,
              <div
                style={{
                  color: p.transactionType === "credit" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {`${p.transactionType === "credit" ? "+" : "-"} ${p.coins}`}
              </div>,
              <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>
                {p.transactionEnv}
              </span>,
              p.event || "-",
            ])}
          />
        </div>
      </div>
    </SideLayout>
  );
};

AdminPassbookPage.getInitialProps = async (ctx) => {
  const { errors, data } = await serverRequest(ctx, {
    url: "/api/ugh/passbook/fetch/all",
    body: {},
    method: "get",
  });
  let passbookMetrics = {};
  if (data) {
    Array.from(data).forEach((p: any) => {
      if (passbookMetrics[p.transactionEnv])
        passbookMetrics[p.transactionEnv] += p.coins;
        else passbookMetrics[p.transactionEnv] = p.coins;
    });
  }
  return { passbooks: data || [], errors: errors || [], passbookMetrics };
};

export default AdminPassbookPage;
