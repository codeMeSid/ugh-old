import { serverRequest } from "../hooks/server-request";
import TopNavbar from "../components/navbar/topnav";
import SponsorSlider from "../components/sponsor-slider";
import Footer from "../components/footer";
import "../public/css/main.css";
import "react-awesome-button/dist/styles.css";


const AppComponent = ({ Component, pageProps, router, currentUser }) => {
  return <>
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
