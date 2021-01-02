import Head from "next/head";
import { serverRequest } from "../hooks/server-request";
import TopNavbar from "../components/navbar/topnav";
import SponsorSlider from "../components/sponsor-slider";
import Footer from "../components/footer";
import "../public/css/main.css";
import "react-awesome-button/dist/styles.css";
import { useEffect } from "react";
import { fire } from "../../server/utils/firebase";
import { useRequest } from "../hooks/use-request";
import { event } from "../socket";
import React from "react";

interface Props {
  Component: any;
  pageProps: any;
  router: any;
  currentUser?: any;
}

class AppComponent extends React.Component<Props> {
  static async getInitialProps(appContext: any) {
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
  }

  constructor(props: any) {
    super(props);
    this.getTitle = this.getTitle.bind(this);
    // this.getServiceWorker = this.getServiceWorker.bind(this);
    this.getNotificationRequest = this.getNotificationRequest.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  getTitle(route: string) {
    const { router } = this.props;
    if (router.route.match("/admin")) return "Admin Panel";
    return {
      "/": "Home",
      "/about": "About",
      "/add-tournament": "Add New Tournament",
      "/gallery": "Gallery",
      "/how-to-play": "How To Play",
      "/my-tournament": "My Tournament",
      "/privacy": "Privacy Policy",
      "/settings": "Settings",
      "/shop": "Shop",
      "/signout": "See You Soon",
      "/signup": "Player Registration",
      "/streams": "Gaming & Live Streams",
      "/tac": "Terms & Conditions",
      "/login": "Login Player",
      "/withdraw": "Withdraw Coins",
      "/account/activate/[ughId]": `${router.query?.ughId}\'s Player Activation`,
      "/account/activate": "Account Activation Mail Sent",
      "/account/forgot-password": "Forgot Password",
      "/account/social/[ughId]": "Social Account Activation",
      "/account/reset-password/[recoveryToken]": "Reset Password",
      "/game/[tournamentId]": "Tournament Brackets",
      "/news/[newsId]": "News Story",
      "/profile/[ughId]": `${router.query?.ughId}\'s Profile`,
      "/profile/edit": "Edit Profile",
      "/profile/passbook": "Passbook",
      "/profile/tournament/[ughId]": "Tournament History",
      "/profile": "My Profile",
      "/sponsors": "UGH Sponsors",
      "/sponsors/[sponsorId]": "Sponsors Confirmation Form",
      "/tournaments/[tournamentId]": "Tournament Detail",
      "/tournaments": "UGH Tournaments",
    }[route];
  }

  async componentDidMount() {
    if (this.props.currentUser) {
      this.getNotificationRequest();
      // this.getServiceWorker();
    }
  }

  // async getServiceWorker() {
  //   try {
  //     if ("serviceWorker" in navigator) {
  //       const swr = await navigator.serviceWorker.register(
  //         "/firebase-messaging-sw.js"
  //       );
  //       this.getNotificationRequest(swr);
  //     }
  //   } catch (error) {
  //     console.log("Service Worker not supported");
  //   }
  // }

  async getNotificationRequest() {
    const status = Notification.permission;
    let token: any;
    if (status === "granted") {
      token = await fire.getFCMToken(this.onMessage);
    } else if (status !== "denied") {
      Notification.requestPermission().then(async (resp) => {
        if (resp === "granted") token = await fire.getFCMToken(this.onMessage);
      });
    }
    if (token && token.isNew) {
      const { doRequest } = useRequest({
        url: "/api/ugh/user/update/fcm",
        body: { fcmToken: token.fcmToken },
        method: "put",
        onError: (errs) => console.log(errs),
      });
      doRequest();
    }
  }

  onMessage(payload: any) {
    const {
      notification: { title, body, click_action },
    } = payload;
    const notification = new Notification(title, {
      body,
      icon: "/android-chrome-192x192.png",
    });
    notification.onclick = (e) => {
      window.location.href = click_action;
    };
  }

  render() {
    const { Component, pageProps, router, currentUser } = this.props;
    const tabTitle = `${
      this.getTitle(router.route) || "Take A Better Path"
    } - Ultimate Gamers Hub | Play Tournaments`;
    return (
      <>
        <Head>
          <title>{tabTitle}</title>
          <meta property="og:title" content={tabTitle} key="ogtitle" />
          <meta property="og:type" content="website" />
          <meta
            property="og:description"
            key="ogdesc"
            content={`Ultimate Gamers Hub: The Ultimate e-sports Hub in India. Ultimate gamers hub is the best e-sports website in India for all pro & casual gamers, where you can find all categories of gaming tournaments and you can also create the tournament of our own.`}
          />
          <meta property="og:locale" content="en_IN" />
          <meta property="og:determiner" content="the" />
          <meta
            property="og:url"
            key="ogurl"
            content="https://www.ultimategamershub.com"
          />
          <meta
            property="og:image"
            content={"/favicon-32x32.png"}
            key="ogimage"
          />
          <meta
            property="og:site_name"
            content={"UltimateGamersHub"}
            key="ogsitename"
          />
          <meta
            name="description"
            content={`Ultimate Gamers Hub: The Ultimate e-sports Hub in India. Ultimate gamers hub is the best e-sports website in India for all pro & casual gamers, where you can find all categories of gaming tournaments and you can also create the tournament of our own.`}
          />
          <meta
            name="keywords"
            content="Ultimate Gamers Hub, Game,Gamer,Match,Players Tournament, Fifa, Ludo, PS4, PS5"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
          />
          <meta name="msapplication-TileColor" content="#ffc40d" />
          <meta name="theme-color" content="#ffffff" />
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
        </Head>
        {!router.route.match("/admin") && !router.route.match("/signout") && (
          <TopNavbar currentUser={currentUser} />
        )}
        <Component
          {...pageProps}
          key={router.route}
          currentUser={currentUser}
        />
        {!router.route.match("/admin") && <SponsorSlider />}
        {!router.route.match("/admin") && <Footer />}
      </>
    );
  }
}

export default AppComponent;

//   return (
//     <>

//     </>
//   );
// };

// AppComponent.getInitialProps = async (appContext) => {

// };

// export default AppComponent;
