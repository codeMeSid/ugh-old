import * as Firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import { randomBytes } from "crypto";

class Fire {
  private fireObj!: Firebase.app.App;

  constructor() {
    this.google = this.google.bind(this);
    this.facebook = this.facebook.bind(this);
    this.storage = this.storage.bind(this);
    this.signout = this.signout.bind(this);
    this.init = this.init.bind(this);
    this.fireObj = this.init();
  }

  private init() {
    return Firebase.initializeApp(
      {
        apiKey: "AIzaSyCxksOeCkOF1QM8UOc-TCMB_il7CUoPt0Y",
        authDomain: "ultimategamershub-c1992.firebaseapp.com",
        databaseURL: "https://ultimategamershub-c1992.firebaseio.com",
        projectId: "ultimategamershub-c1992",
        storageBucket: "ultimategamershub-c1992.appspot.com",
        messagingSenderId: "134891589765",
        appId: "1:134891589765:web:ce9a1c372f91dd9c6c99ec",
        measurementId: "G-1SQB81XMRW",
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