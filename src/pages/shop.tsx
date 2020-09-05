import Head from 'next/head';
import MainLayout from "../components/layout/mainlayout"
import { serverRequest } from "../hooks/server-request"
import { GetServerSidePropsContext } from 'next';
import { CoinDoc } from "../../server/models/coin";
import ShopCard from "../components/card/shop";

const Shop = ({ currentUser, coins, apiKey }: { currentUser: any, coins: Array<CoinDoc>, apiKey: string }) => {
    return <>
        <Head>
            <script src="https://checkout.razorpay.com/v1/checkout.js" />
        </Head>
        <MainLayout>
            <section className="shop">
                <div className="shop__container">
                    {coins.map(coin => {
                        return <ShopCard
                            key={Math.random()}
                            coin={coin}
                            currentUser={currentUser}
                            apiKey={apiKey} />
                    })}
                </div>
            </section>
        </MainLayout>
    </>
}

Shop.getInitialProps = async (ctx: GetServerSidePropsContext) => {

    const { data, errors } = await serverRequest(ctx, { url: "/api/ugh/coin/fetch/active", body: {}, method: "get" });
    const req: any = ctx.req;
    return {
        coins: data || [],
        errors,
        currentUser: req?.currentUser,
        apiKey: process.env.RAZORPAY_ID
    };
}

export default Shop;