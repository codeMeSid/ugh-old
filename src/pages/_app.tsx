import Head from 'next/head'
import { serverRequest } from "../hooks/server-request";
import TopNavbar from "../components/navbar/topnav";
import SponsorSlider from "../components/sponsor-slider";
import Footer from "../components/footer";
import "../public/css/main.css";
import "react-awesome-button/dist/styles.css";


const AppComponent = ({ Component, pageProps, router, currentUser }) => {
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#ffc40d" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
    {!router.route.match('\/admin') && <TopNavbar currentUser={currentUser} />}
    <Component {...pageProps} key={router.route} currentUser={currentUser} />
    {!router.route.match('\/admin') && <SponsorSlider />}
    {!router.route.match('\/admin') && <Footer />}

  </>
}

AppComponent.getInitialProps = async (appContext) => {
  let pageProps = {};
  const { data } = await serverRequest(appContext.ctx, { url: "/api/ugh/user/current", method: "get", body: {} });
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return {
    pageProps,
    currentUser: appContext?.ctx?.req?.currentUser || data?.currentUser
  };
};


export default AppComponent;
