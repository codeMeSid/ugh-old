import React, { useState, useEffect } from "react";
import SideLayout from "../../../components/layout/sidelayout";
import Table from "../../../components/table";
import { useRequest } from "../../../hooks/use-request";
import { TransactionDoc } from "../../../../server/models/transaction";
import Link from "next/link";
import { format } from "date-fns";
import ProgressButton from "../../../components/button/progress";
import XLSX from "xlsx";
import Router from "next/router";
import { AiFillDelete } from "react-icons/ai";
import IconDialogButton from "../../../components/button/icon-dialog";

const AdminTransactionDashboard = () => {
  const [tData, setTData] = useState([]);
  const [sheetData, setSheetData] = useState([]);
  const [messages, setMessages] = useState([]);
  const TableLink = (name: string, id: string) => (
    <Link href={`/admin/transactions/${id}`}>
      <a className="table__link">{name}</a>
    </Link>
  );
  const { doRequest } = useRequest({
    url: "/api/ugh/transaction/fetch/all",
    body: {},
    method: "get",
    onSuccess: (data: Array<TransactionDoc>) => {
      setTData(
        data.map((t) => [
          TableLink(t.orderId, t.orderId),
          <div>&#8377;{t.amount}</div>,
          format(new Date(t.createdAt), "dd/MM/yyyy hh:mm a"),
          <div style={{ color: t.status === "requested" ? "red" : "black" }}>
            {t.status.toUpperCase()}
          </div>,
          <IconDialogButton
            Icon={AiFillDelete}
            iconStyle={{ color: "red", fontSize: 24 }}
            style={{ width: 300 }}
            onAction={(onSuccess, onError) => {
              const { doRequest: deleteUser } = useRequest({
                url: `/api/ugh/admin/delete/transaction/${t.id}`,
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
      const filteredData = data.filter(
        (d) => d.status !== "created" && d.status !== "captured"
      );
      const sheetDataMap = filteredData.map((d) => [
        format(new Date(d.createdAt), "dd/MM/yyyy hh:mm a"),
        d.orderId,
        d.razorpayId,
        d.amount,
        d.status,
      ]);
      setSheetData(sheetDataMap);
    },
    onError: (errors) => setMessages(errors),
  });
  useEffect(() => {
    doRequest();
  }, []);

  const downloadExcelHandler = async (_: any, next: any) => {
    const sheetTitle = [
      "Created At",
      "Order ID",
      "Razorpay ID",
      "Amount",
      "Status",
    ];
    const ws = XLSX.utils.aoa_to_sheet([sheetTitle, ...sheetData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "UGH TRANSACTIONS");
    XLSX.writeFile(wb, "UGH_TRANSACTIONS.xlsx");
    doRequest();
    next();
  };

  return (
    <SideLayout messages={messages} title={`bank(${tData.length})`}>
      <div style={{ margin: "1rem 0" }}>
        <ProgressButton
          text="Download Excel"
          type="github"
          onPress={downloadExcelHandler}
        />
      </div>

      <Table
        headers={[
          {
            text: "trans id",
            isResponsive: false,
          },
          {
            text: "amount",
            isResponsive: true,
          },
          {
            text: "created at",
            isResponsive: false,
          },
          {
            text: "status",
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

export default AdminTransactionDashboard;
