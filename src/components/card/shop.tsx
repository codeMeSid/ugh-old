import { CoinDoc } from "../../../server/models/coin";
import Link from "next/link";
import Router from "next/router";
import ProgressButton from "../button/progress";
import Button from "../button/main";
import { useRequest } from "../../hooks/use-request";

const Coin = require("../../public/asset/coins.png");

const ShopCard = ({ coin, currentUser, apiKey }: { coin: CoinDoc, currentUser: any, apiKey: string }) => {
    const { doRequest } = useRequest({
        url: "/api/ugh/transaction/create",
        body: {
            amount: coin.cost,
        },
        method: "post",
        onSuccess: async (orderId: string) => {
            try {
                const options = {
                    key: apiKey,
                    name: "Ultimate Gamer Hub",
                    description: "Ultimate Gamers Coin Purchase",
                    order_id: orderId,
                    handler: async (response) => {
                        const { razorpay_order_id, razorpay_payment_id } = response;
                        const { doRequest } = await useRequest({
                            url: `/api/ugh/transaction/verify/${coin.id}`,
                            method: "post",
                            body: { orderId: razorpay_order_id, paymentId: razorpay_payment_id },
                            onSuccess: () => Router.push("/withdraw")
                        });
                        await doRequest();
                    }
                };
                const rzp = (window as any).Razorpay(options);
                if (rzp) rzp.open();
            } catch (error) {
                // add catch errors
            }

        }
    });
    return <div className="shop__card">
        <div className="shop__card__value">{coin.value} COINS</div>
        <img src={Coin} alt="ugh coins" className="shop__card__coin" />
        <div className="shop__card__cost">&#8377; {coin.cost}</div>
        {
            currentUser
                ? <ProgressButton onPress={async (_, next) => {
                    await doRequest();
                    next()
                }} text="BUY" type="link" size="small" />
                : <Link href="/login">
                    <a>
                        <Button type="link" size="small" text="BUY" />
                    </a>
                </Link>
        }
    </div>
}

export default ShopCard;