import "../public/css/main.css";
import "react-awesome-button/dist/styles.css";


const AppComponent = ({ Component, pageProps, router, currentUser }) => {


  return <Component {...pageProps} key={router.route} currentUser={currentUser} />
}

// AppComponent.getInitialProps = async (appContext) => {
//   let pageProps = {};
//   if (appContext.Component.getInitialProps) {
//     pageProps = await appContext.Component.getInitialProps(appContext.ctx);
//   }
//   return {
//     pageProps,
//   };
// };


export default AppComponent;
