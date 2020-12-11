import * as Firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/messaging";
import { randomBytes } from "crypto";
import localforage from 'localforage';

class Fire {
  private fireObj!: Firebase.app.App;
  private messenger!: Firebase.messaging.Messaging;

  constructor() {
    this.google = this.google.bind(this);
    this.facebook = this.facebook.bind(this);
    this.storage = this.storage.bind(this);
    this.signout = this.signout.bind(this);
    this.initMessaging = this.initMessaging.bind(this);
    this.init = this.init.bind(this);
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

  async initMessaging(): Promise<unknown> {
    try {
      if (!window) return;
      const messenger = this.fireObj.messaging();
      let token = await localforage.getItem("fm_token");
      if (!token) {
        const status = await Notification.requestPermission();
        if (status && status === "granted") {
          token = await messenger.getToken();
          console.log({ messengerToken: token })
          if (token) {
            console.log("token is being set")
            localforage.setItem("fm_token", token);
          }
        }
      }
      if (token)
        messenger.onMessage(function (payload) {
          console.log({ messenger: payload });
        });
      return token;
    } catch (error) {
      console.log({ messengerError: error })
      return null;
    }
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
  async google(): Promise<Firebase.User> {
    if (!this.fireObj) return;
    const fireObj = this.fireObj;
    const auth = fireObj.auth();
    const provider = new Firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    return user;
  }

  async facebook(): Promise<Firebase.User> {
    if (!this.fireObj) return;
    const fireObj = this.fireObj;
    const auth = fireObj.auth();
    const provider = new Firebase.auth.FacebookAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    return user;
  }

  async signout() {
    if (!this.fireObj) return;
    const fireObj = this.fireObj;
    await fireObj.auth().signOut();
  }
}

export const fire = new Fire();



// serverkey : AAAAH2gqUIU:APA91bHv-S_mabLVJq6NlJPuq8PTeNoyuWMHeGDGrQ6w-IElDn2S034boB9EvTm_WHI2NFIEHpnCmSHYGZ90CJ_DXCi12-9yvrdwsts_79RjmKVc8aHazU0Ial1tI33GDtR5U8xUDVvC
// sender id : 134891589765
// key pair : BOkObZx8NB2OgJYPcavusgDHFa1d0jk5XJMLCf_6dXws6EeQ3xR6H4hBGMf1LwiSzUBliSHMpJygxdJ2OV9YkDk