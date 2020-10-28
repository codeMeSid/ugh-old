import MainLayout from "../components/layout/mainlayout";
import { serverRequest } from "../hooks/server-request";
import { UserDoc } from "../../server/models/user";
import { TransactionDoc } from "../../server/models/transaction";
import Table from "../components/table";
import { format } from 'date-fns';
import { useRequest } from "../hooks/use-request";
import ProgressButton from "../components/button/progress";
import Router from 'next/router';
import Input from "../components/input/input";
import { useState } from "react";

const bgImage = require("../public/asset/signup.jpg");

const Withdraw = ({ transactions, coins, errors }: { coins: number, transactions: Array<TransactionDoc>, walletBalance400: boolean, withdrawRequestMade: boolean, errors: Array<any> }) => {
    const [requestCoin, setRequestCoin] = useState(coins || 0);
    const [messages, setMessages] = useState(errors);
    const { doRequest } = useRequest({
        url: "/api/ugh/transaction/create/request",
        method: "post",
        body: {
            coins: requestCoin
        },
        onError: (errors) => setMessages(errors),
        onSuccess: Router.reload
    });

    return <MainLayout messages={messages}>
        <div style={{ backgroundImage: `url(${bgImage})` }} className="detail__bg">
            <div className="withdraw">
                <div className="withdraw__head">
                    <div className="withdraw__head__coins">you currently have {coins} coins</div>
                    <div style={{ width: "35rem", margin: "0 auto" }} >
                        <Input placeholder="withdraw coins" name="coins" type="number" value={requestCoin} onChange={(_, val) => setRequestCoin(val)} isWhite/>
                    </div>
                    <ProgressButton type="link" text="Make Request" onPress={async (_, next) => {
                        if (requestCoin > coins || requestCoin <= 0) {
                            next();
                            setMessages([{ message: "Cannot withdraw more than balance" }])
                            return;
                        }
                        await doRequest();
                        next()
                    }} />
                </div>
                <div className="withdraw__body">
                    <Table headers={[
                        {
                            text: "refId",
                            isResponsive: false
                        },
                        {
                            text: "amount",
                            isResponsive: false
                        },
                        {
                            text: "created at",
                            isResponsive: false
                        },
                        {
                            text: "status",
                            isResponsive: false
                        }
                    ]} data={transactions.map(transaction => {
                        const date = new Date(transaction.createdAt);
                        return [transaction.orderId, `₹${transaction.amount}`, format(date, "dd/MM/yy,H:mm a"), transaction.status.toUpperCase()]
                    })} />
                </div>
            </div>
        </div>
    </MainLayout>
}

Withdraw.getInitialProps = async (ctx) => {
    const { data: transactions, errors: errorsA }: { data: Array<TransactionDoc>, errors: any } = await serverRequest(ctx, { url: "/api/ugh/transaction/fetch", method: "get", body: {} });
    const { data: user, errors: errorsB }: { data: UserDoc, errors: any } = await serverRequest(ctx, { url: "/api/ugh/user/fetch/detail", method: "get", body: {} });

    const errors = [];
    if (errorsA) errors.push(...errorsA)
    if (errorsB) errors.push(...errorsB)

    return {
        transactions: transactions || [],
        coins: user?.wallet?.coins || 0,
        errors
    }
}

export default Withdraw;