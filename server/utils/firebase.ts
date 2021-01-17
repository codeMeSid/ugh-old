import * as Firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/messaging";
import { randomBytes } from "crypto";
import localforage from "localforage";
import axios from "axios";

class Fire {
  private fireObj!: Firebase.app.App;
  private confirmation!: Firebase.auth.ConfirmationResult;
  private rcv!: Firebase.auth.RecaptchaVerifier;

  constructor() {
    this.google = this.google.bind(this);
    this.facebook = this.facebook.bind(this);
    this.storage = this.storage.bind(this);
    this.signout = this.signout.bind(this);
    this.init = this.init.bind(this);
    this.getRecaptcha = this.getRecaptcha.bind(this);
    this.fireObj = this.init();
  }

  private init() {
    return Firebase.initializeApp(
      {
        apiKey: "AIzaSyCSXN_s65RoG7CtnHCexpZ_UQkBvkN8OEA",
        authDomain: "ultimategamershub.firebaseapp.com",
        databaseURL: "https://ultimategamershub.firebaseio.com",
        projectId: "ultimategamershub",
        storageBucket: "ultimategamershub.appspot.com",
        messagingSenderId: "286356059040",
        appId: "1:286356059040:web:ab0ca6afd29f31ff65aac5",
        measurementId: "G-MB4E67PEG4",
      },
      Math.random().toString()
    );
  }

  async storage(
    file: any,
    progressUpdate?: (progress: number) => any
  ): Promise<unknown> {
    if (!this.fireObj) return;
    const fireObj = this.fireObj;
    const storage = fireObj.storage();
    const name =
      randomBytes(4).toString("hex") + file.name.trim().split(/ +/).join(" ");
    const uploadTask = storage.ref(`ugh/${name}`).put(file);

    const url = await new Promise((resolve, reject) =>
      uploadTask.on(
        "state_changed",
        (data) => {
          if (progressUpdate)
            progressUpdate(
              Math.round((data.bytesTransferred / data.totalBytes) * 100)
            );
        },
        (error) => {
          throw new Error(error.message);
        },
        async () => {
          const downloadUrl = await storage
            .ref("ugh")
            .child(name)
            .getDownloadURL();
          resolve(downloadUrl);
        }
      )
    );
    return url;
  }

  getRecaptcha(container: string, onVerify: (response: any) => any) {
    if (!this.fireObj) return false;
    this.rcv = new Firebase.auth.RecaptchaVerifier(
      container,
      {
        callback: onVerify,
      },
      this.fireObj
    );
    return this.rcv;
  }

  async phoneAuth(phone: string) {
    if (!this.fireObj) return;
    try {
      this.confirmation = await this.fireObj
        .auth()
        .signInWithPhoneNumber(phone, this.rcv);
    } catch (error) {
      console.log({ error });
    }
    return !!this.confirmation;
  }

  async verifyPhoneAuth(verificiationCode: string) {
    let status: boolean, message: any;
    try {
      if (!this.fireObj && !this.confirmation) return;
      const result = await this.confirmation.confirm(verificiationCode);
      message = result.user;
      status = !!result.user;
    } catch (error) {
      status = false;
      message = "Invalid or Expired OTP";
    }
    return { status, message };
  }

  async google(): Promise<Firebase.User> {
    if (!this.fireObj) return;
    const fireObj = this.fireObj;
    const auth = fireObj.auth();
    const provider = new Firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    return result.user;
  }

  async facebook(): Promise<Firebase.User> {
    if (!this.fireObj) return;
    const fireObj = this.fireObj;
    const auth = fireObj.auth();
    const provider = new Firebase.auth.FacebookAuthProvider();
    const result = await auth.signInWithPopup(provider);
    return result.user;
  }

  async signout() {
    if (!this.fireObj) return;
    const fireObj = this.fireObj;
    await fireObj.auth().signOut();
  }

  async getFCMToken(onMessage: (payload: any) => any) {
    try {
      const messaging = this.fireObj.messaging();
      const fcmToken: any = await localforage.getItem("FCM_TOKEN");
      if (fcmToken) {
        messaging.onMessage(onMessage);
        return { fcmToken, isNew: false };
      }
      const newFcmToken = await messaging.getToken({
        vapidKey:
          "BAEfSb0Bqar1LispPKrxu3wARzIQ6KEXkd5W6mui3bXZRdejQh6PTx4vHE5iU55MRe0t4NobD93LkWwztqc_hQ4",
      });
      if (newFcmToken) {
        localforage.setItem("FCM_TOKEN", newFcmToken);
        messaging.onMessage(onMessage);
        return { fcmToken: newFcmToken, isNew: true };
      }
    } catch (error) {
      console.log(error.message);
    }
    return null;
  }

  async removeFcmToken() {
    const messaging = this.fireObj.messaging();
    await messaging.deleteToken();
    await localforage.removeItem("FCM_TOKEN");
  }

  sendNotification(to: string, body: string, action: string) {
    axios
      .post(
        "https://fcm.googleapis.com/fcm/send",
        {
          to,
          notification: {
            title: "UltimateGamersHub Notification",
            body: body,
            click_action: `https://ultimategamershub.com${action}`,
            icon:
              "https://firebasestorage.googleapis.com/v0/b/ultimategamershub.appspot.com/o/ugh%2FUGH_Icon_final.webp?alt=media&token=334a61cb-7bbb-454c-b9c5-edf0473e8ec2",
          },
        },
        {
          headers: {
            Authorization:
              "key=AAAAQqwms6A:APA91bHPqEs8fAo93-RRp11ilWDakBl1zq7UOAGeEOB6ttCfZznTRjRZNkp92fvwkJAOq4PIWF3hpbNmdJYJpW_LMQ3LPaxQYQW75crNzXIuf3ebqkSmHOzWwlBix4ILBcYc_sRZG2oU",
          },
        }
      )
      .then((res) =>
        console.log({
          notificationSuccess: !!res.data.success,
          reason: res.data.results,
        })
      )
      .catch((error) => console.error(error));
  }
}

export const fire = new Fire();
