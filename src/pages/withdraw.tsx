import MainLayout from "../components/layout/mainlayout";
import { serverRequest } from "../hooks/server-request";
import { UserDoc } from "../../server/models/user";
import { TransactionDoc } from "../../server/models/transaction";
import Table from "../components/table";
import { format } from "date-fns";
import { useRequest } from "../hooks/use-request";
import ProgressButton from "../components/button/progress";
import Router from "next/router";
import Input from "../components/input/input";
import { useState } from "react";

const Withdraw = ({
  transactions,
  coins,
  errors,
}: {
  coins: number;
  transactions: Array<TransactionDoc>;
  walletBalance400: boolean;
  withdrawRequestMade: boolean;
  errors: Array<any>;
}) => {
  const [requestCoin, setRequestCoin] = useState(coins);
  const [bank, setBank] = useState("");
  const [bankAC, setBankAC] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState(errors);

  return (
    <MainLayout messages={messages}>
      <div className="detail__bg profile">
        <div className="withdraw">
          <div className="withdraw__head">
            <div className="withdraw__head__coins">
              you currently have {coins} coins
            </div>
            <div style={{ width: "35rem", margin: "0 auto" }}>
              <Input
                placeholder="withdraw coins"
                name="coins"
                type="number"
                value={requestCoin}
                onChange={(_, val) => setRequestCoin(val)}
                isWhite
              />
              <Input
                placeholder="bank account name"
                type="text"
                value={name}
                onChange={(_, val) => setName(val)}
                isWhite
              />
              <Input
                placeholder="Account #"
                name="account"
                type="text"
                value={bankAC}
                onChange={(_, val) => setBankAC(val)}
                isWhite
              />
              <Input
                placeholder="bank name"
                name="bank"
                type="text"
                value={bank}
                onChange={(_, val) => setBank(val)}
                isWhite
              />
              <Input
                placeholder="bank IFSC code"
                name="bankIfsc"
                type="text"
                value={ifsc}
                onChange={(_, val) => setIfsc(val)}
                isWhite
              />
            </div>

            <ProgressButton
              type="link"
              text="Make Request"
              onPress={async (_, next) => {
                if (requestCoin > coins || requestCoin <= 0) {
                  next(false, "Failed");
                  return setMessages([
                    { message: "Cannot withdraw more than balance" },
                  ]);
                }
                const { doRequest } = useRequest({
                  url: "/api/ugh/transaction/create/request",
                  method: "post",
                  body: {
                    coins: requestCoin,
                    bank,
                    bankAC,
                    ifsc,
                    name,
                  },
                  onError: (errors) => {
                    next(false, "Failed");
                    setMessages(errors);
                  },
                  onSuccess: Router.reload,
                });
                doRequest();
              }}
            />
          </div>
          <div className="withdraw__body">
            <Table
              headers={[
                {
                  text: "ref Id",
                  isResponsive: false,
                },
                {
                  text: "amount",
                  isResponsive: false,
                },
                {
                  text: "created at",
                  isResponsive: false,
                },
                {
                  text: "status",
                  isResponsive: false,
                },
              ]}
              data={transactions.map((transaction) => {
                const date = new Date(transaction.createdAt);
                return [
                  transaction.orderId,
                  `₹${transaction.amount}`,
                  format(date, "dd/MM/yy,H:mm a"),
                  transaction.status.toUpperCase(),
                ];
              })}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

Withdraw.getInitialProps = async (ctx) => {
  const {
    data: transactions,
    errors: errorsA,
  }: { data: Array<TransactionDoc>; errors: any } = await serverRequest(ctx, {
    url: "/api/ugh/transaction/fetch",
    method: "get",
    body: {},
  });
  const {
    data: user,
    errors: errorsB,
  }: { data: UserDoc; errors: any } = await serverRequest(ctx, {
    url: "/api/ugh/user/fetch/detail",
    method: "get",
    body: {},
  });

  const errors = [];
  if (errorsA) errors.push(...errorsA);
  if (errorsB) errors.push(...errorsB);

  return {
    transactions: transactions || [],
    coins:
      user?.tournaments
        .filter((t) => t.didWin)
        .reduce((acc, t) => acc + t.coins, 0) || 0,
    errors,
  };
};

export default Withdraw;
