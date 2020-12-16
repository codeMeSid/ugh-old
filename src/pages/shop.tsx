import Head from "next/head";
import MainLayout from "../components/layout/mainlayout";
import { serverRequest } from "../hooks/server-request";
import { GetServerSidePropsContext } from "next";
import { CoinDoc } from "../../server/models/coin";
import ShopCard from "../components/card/shop";
import { useState } from "react";

const Shop = ({
  currentUser,
  coins,
  apiKey,
  errors,
}: {
  currentUser: any;
  coins: Array<CoinDoc>;
  apiKey: string;
  errors: any;
}) => {
  const [messages, setMessages] = useState(errors);
  return (
    <>
      <Head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      </Head>
      <MainLayout messages={messages}>
        <section className="shop">
          <div style={{ textAlign: "center", fontSize: 45 }}>SHOP COINS</div>
          <div className="shop__container">
            {coins.map((coin) => {
              return (
                <ShopCard
                  onError={(errors) => setMessages(errors)}
                  onSuccess={() =>
                    setMessages([
                      { message: "Purchase successful", type: "success" },
                    ])
                  }
                  key={Math.random()}
                  coin={coin}
                  currentUser={currentUser}
                  apiKey={apiKey}
                />
              );
            })}
          </div>
        </section>
      </MainLayout>
    </>
  );
};

Shop.getInitialProps = async (ctx: GetServerSidePropsContext) => {
  const { data, errors } = await serverRequest(ctx, {
    url: "/api/ugh/coin/fetch/active",
    body: {},
    method: "get",
  });
  const req: any = ctx.req;
  return {
    coins: data || [],
    errors: errors || [],
    currentUser: req?.currentUser,
    apiKey: process.env.RAZORPAY_ID,
  };
};

export default Shop;
