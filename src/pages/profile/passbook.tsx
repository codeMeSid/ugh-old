import { PassbookDoc } from "../../../server/models/passbook";
import MainLayout from "../../components/layout/mainlayout";
import Table from "../../components/table";
import { serverRequest } from "../../hooks/server-request";
import { format } from "date-fns";

const ProfilePassbookPage = ({
  passbooks,
  errors,
}: {
  passbooks: Array<PassbookDoc>;
  errors: any;
}) => (
  <MainLayout messages={errors}>
    <div className="detail__bg">
      <div className="withdraw" style={{ backgroundColor: "#01071a" }}>
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            fontSize: 38,
          }}
        >
          PASSBOOK
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
          details of all transactions credits & debits
        </div>
        <div className="withdraw__body">
          <Table
            hasPagination
            headers={[
              { text: "date", isResponsive: false },
              { text: "coins", isResponsive: false },
              { text: "reason", isResponsive: false },
              { text: "event", isResponsive: false },
            ]}
            data={passbooks.map((p) => [
              format(new Date(p.date), "dd/MM/yy,HH:mm a"),
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
    </div>
  </MainLayout>
);

ProfilePassbookPage.getInitialProps = async (ctx) => {
  const { data, errors } = await serverRequest(ctx, {
    url: "/api/ugh/passbook/fetch",
    body: {},
    method: "get",
  });
  return { passbooks: data || [], errors: errors || [] };
};

export default ProfilePassbookPage;
