import { serverRequest } from "../../../hooks/server-request";
import SideLayout from "../../../components/layout/sidelayout";
import { TransactionDoc } from "../../../../server/models/transaction";
import Input from "../../../components/input/input";
import { format } from "date-fns";
import ProgressButton from "../../../components/button/progress";
import { useRequest } from "../../../hooks/use-request";
import Router from "next/router";
import { useState } from "react";
import Link from "next/link";
import FileInput from "../../../components/input/file";

const TransactionDetail = ({
  transaction,
  errors,
  currentUser,
}: {
  transaction: TransactionDoc;
  errors: any;
  currentUser?: any;
}) => {
  const [tId, setTId] = useState("");
  const [messages, setMessages] = useState(errors);
  const { doRequest: acceptRequest } = useRequest({
    url: `/api/ugh/transaction/update/request/${transaction?.orderId}`,
    method: "put",
    body: {
      accepted: true,
      razorpayId: tId,
    },
    onSuccess: Router.reload,
    onError: (errors) => setMessages(errors),
  });
  const { doRequest: rejectRequest } = useRequest({
    url: `/api/ugh/transaction/update/request/${transaction?.orderId}`,
    method: "put",
    body: {
      accepted: false,
    },
    onSuccess: Router.reload,
    onError: (errors) => setMessages(errors),
  });

  return (
    <SideLayout
      currentUser={currentUser}
      messages={messages}
      title={`${transaction?.orderId}`}
    >
      <div className="row">
        <div className="col">
          <Input placeholder="order Id" value={transaction?.orderId} disabled />
        </div>
        <div className="col">
          <Input
            placeholder="transactions id"
            onChange={(_, val) => setTId(val)}
            value={transaction?.razorpayId}
            disabled={transaction?.status !== "requested"}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Input placeholder="amount" value={transaction?.amount} disabled />
        </div>
        <div className="col">
          <Input
            placeholder="created at"
            value={format(
              new Date(
                transaction?.createdAt ? transaction?.createdAt : Date.now()
              ),
              "dd/MM/yyyy hh:mm a"
            )}
            disabled
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          {transaction?.userDetail ? (
            <Input
              placeholder="UGH ID"
              value={transaction?.userDetail?.ughId}
              disabled
            />
          ) : (
            <Link href={`/admin/users/${transaction?.user}`}>
              <a style={{ cursor: "pointer" }}>
                <Input placeholder="user" value={transaction?.user} disabled />
              </a>
            </Link>
          )}
        </div>
        <div className="col">
          <Input
            placeholder="status"
            value={transaction?.status?.toUpperCase()}
            disabled
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Input placeholder="Bank" value={transaction?.bank} disabled />
        </div>
        <div className="col">
          <Input placeholder="Bank IFSC" value={transaction?.ifsc} disabled />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Input placeholder="Account #" value={transaction?.bankAC} disabled />
        </div>
        <div className="col">
          <Input
            placeholder="Account Name"
            value={transaction?.name}
            disabled
          />
        </div>
      </div>
      {transaction?.userDetail && (
        <div className="row">
          <div className="col">
            <Input
              placeholder="Aadhar Card"
              value={transaction?.userDetail?.idProof?.aadharCard}
              disabled
            />
          </div>
          <div className="col">
            <a
              href={transaction?.userDetail?.idProof?.aadharUrl}
              target="_blank"
            >
              <FileInput
                name="a"
                placeholder="Aadhar card photo"
                value={transaction?.userDetail?.idProof?.aadharUrl}
              />
            </a>
          </div>
        </div>
      )}
      {transaction?.status === "requested" && (
        <div className="row">
          <div className="col" style={{ marginRight: 10 }}>
            <ProgressButton
              onPress={async (_, next) => {
                await rejectRequest();
                next();
              }}
              text="Reject"
              size="medium"
              type="youtube"
            />
          </div>
          <div className="col">
            <ProgressButton
              onPress={async (_, next) => {
                await acceptRequest();
                next();
              }}
              text="Accept"
              size="medium"
              type="link"
            />
          </div>
        </div>
      )}
    </SideLayout>
  );
};

TransactionDetail.getInitialProps = async (ctx) => {
  const { orderId } = ctx.query;
  const { data, errors } = await serverRequest(ctx, {
    url: `/api/ugh/transaction/fetch/detail/${orderId}`,
    body: {},
    method: "get",
  });
  return { transaction: data, errors: errors || [] };
};
export default TransactionDetail;

// user: string;
// orderId: string;
// razorpayId: string;
// amount: number;
// createdAt: Date;
// status: TransactionTypes;
