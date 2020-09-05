import MainLayout from "../components/layout/mainlayout";
import { serverRequest } from "../hooks/server-request";
import { UserDoc } from "../../server/models/user";
import { TransactionDoc } from "../../server/models/transaction";
import Table from "../components/table";
import { format } from 'date-fns';
import { useRequest } from "../hooks/use-request";
import ProgressButton from "../components/button/progress";
import Link from "next/link";
import Router from 'next/router';

const Withdraw = ({ transactions,
    walletBalance400,
    withdrawRequestMade, coins }: { coins: number, transactions: Array<TransactionDoc>, walletBalance400: boolean, withdrawRequestMade: boolean }) => {

    const { doRequest } = useRequest({
        url: "/api/ugh/transaction/create/request",
        method: "get",
        body: {},
        onSuccess: Router.reload
    });

    return <MainLayout>
        <div className="withdraw">
            <div className="withdraw__head">
                <div className="withdraw__head__title">withdraw coins</div>
                <div className="withdraw__head__coins">you currently have {coins} coins</div>
                {!walletBalance400 ? <div className="withdraw__head__warning">
                    <div>insufficient coins to withdraw.</div>
                    The minimum amount to withdraw is 400 coins.
                    <div>For more details <span>
                        <Link href={"/how-to-play"}>
                            <a className="withdraw__head__warning__red">&gt; How to play</a>
                        </Link>
                    </span>.
                    </div>
                </div>
                    : withdrawRequestMade
                        ? <div className="withdraw__head__done">request made,waiting for admin response</div>
                        : <ProgressButton type="link" text="Make Request" onPress={async (_, next) => {
                            await doRequest();
                            next()
                        }} />}
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
    </MainLayout>
}

Withdraw.getInitialProps = async (ctx) => {
    const { data: transactions }: { data: Array<TransactionDoc> } = await serverRequest(ctx, { url: "/api/ugh/transaction/fetch", method: "get", body: {} });
    const { data: user }: { data: UserDoc } = await serverRequest(ctx, { url: "/api/ugh/user/fetch/detail", method: "get", body: {} });
    let withdrawRequestMade = false;
    let walletBalance400 = false;
    if (user) {
        walletBalance400 = user.wallet.coins >= 400;
        withdrawRequestMade = transactions.filter(transaction => transaction.status === "requested").length > 0;
    }
    return {
        transactions: transactions || [],
        walletBalance400,
        withdrawRequestMade,
        coins: user?.wallet?.coins || 0
    }
}

export default Withdraw;