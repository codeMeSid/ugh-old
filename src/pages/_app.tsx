import "../public/css/main.css";
import "react-awesome-button/dist/styles.css";
import { serverRequest } from "../hooks/server-request";


const AppComponent = ({ Component, pageProps, router, currentUser }) => <Component {...pageProps} key={router.route} currentUser={currentUser} />

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
