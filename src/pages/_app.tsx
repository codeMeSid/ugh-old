import Head from "next/head";
import { serverRequest } from "../hooks/server-request";
import TopNavbar from "../components/navbar/topnav";
import SponsorSlider from "../components/sponsor-slider";
import Footer from "../components/footer";
import "../public/css/main.css";
import "react-awesome-button/dist/styles.css";
import Title from "../components/title";

const AppComponent = ({ Component, pageProps, router, currentUser }) => {
  return (
    <>
      <Head>
        <Title route={router.route} query={router.query} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content={`Ultimate Gamers Hub: The Ultimate e-sports Hub in India.
                    Ultimate gamers hub is the best e-sports website in India for all pro & casual gamers,
                    where you can find all categories of gaming tournaments and you can also create the tournament of our own.`}
        />
        <meta
          name="keywords"
          content="Ultimate Gamers Hub, Game, Tournament, Fifa, Pes, PS4, PS5"
        />
        <meta httpEquiv="refresh" content="30" />
      </Head>
      {!router.route.match("/admin") && !router.route.match("/signout") && (
        <TopNavbar currentUser={currentUser} />
      )}
      <Component {...pageProps} key={router.route} currentUser={currentUser} />
      {!router.route.match("/admin") && <SponsorSlider />}
      {!router.route.match("/admin") && <Footer />}
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  let pageProps = {};
  const { data } = await serverRequest(appContext.ctx, {
    url: "/api/ugh/user/current",
    method: "get",
    body: {},
  });
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return {
    pageProps,
    currentUser: appContext?.ctx?.req?.currentUser || data?.currentUser,
  };
};

export default AppComponent;
