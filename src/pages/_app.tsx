import "../public/css/main.css";
import "react-awesome-button/dist/styles.css";
import Footer from "../components/footer";
import SponsorSlider from "../components/sponsor-slider";


const AppComponent = ({ Component, pageProps, router, currentUser }) => {


  return <>
    <Component {...pageProps} key={router.route} currentUser={currentUser} />
    <SponsorSlider />
    <Footer />
  </>
}

AppComponent.getInitialProps = async (appContext) => {
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return {
    pageProps,
    currentUser: appContext.ctx.req.currentUser
  };
};


export default AppComponent;
