import { format } from "date-fns";
import React from "react";
import SideLayout from "../../../../components/layout/sidelayout";
import Table from "../../../../components/table";
import { serverRequest } from "../../../../hooks/server-request";

const AdminUserPassbook = ({ passbooks, errors, ughId }) => {
  return (
    <SideLayout title="passbook">
      <div className="detail">
        <div className="row">
          <h1 style={{ fontWeight: 600, fontSize: 36 }}>{ughId}</h1>
        </div>
        <div className="row">
          <Table
            headers={[
              { text: "date", isResponsive: false },
              { text: "type", isResponsive: false },
              { text: "coins", isResponsive: false },
            ]}
            data={passbooks?.map((p) => [
              format(new Date(p.date).valueOf(), "do MMMM yyy hh:mm a"),
              `${p.transactionEnv}`.toUpperCase(),
              <div
                style={{
                  color: p.transactionType === "credit" ? "green" : "red",
                }}
              >
                {`${p.transactionType === "credit" ? "+" : "-"} ${p.coins}`}
              </div>,
            ])}
          />
        </div>
      </div>
    </SideLayout>
  );
};

AdminUserPassbook.getInitialProps = async (ctx: any) => {
  const { ughId } = ctx.query;
  if (!ughId)
    return {
      passbooks: [],
      errors: [{ message: "Ugh Id is required" }],
      ughId: "",
    };
  const { data, errors } = await serverRequest(ctx, {
    url: `/api/ugh/passbook/fetch/${ughId}`,
    body: {},
    method: "get",
  });
  return { passbooks: data, errors: errors || [], ughId };
};

export default AdminUserPassbook;
