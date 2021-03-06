import mongoose from "mongoose";

import { Password, UserRecovery } from "@monsid/ugh-og";
import {
  UserActivity,
  UserRole,
  UserAddress,
  UserGamerProfile,
  UserIdProof,
  UserSettings,
} from "@monsid/ugh-og";
import { UserCart } from "../utils/interface/user/cart";

interface UserAttrs {
  ughId: string;
  name: string;
  email: string;
  dob?: Date;
  password?: string;
  uploadUrl?: string;
  address?: UserAddress;
  mobile?: string;
}

export interface UserDoc extends mongoose.Document {
  email: string;
  ughId: string;
  name: string;
  password: string;
  uploadUrl: string;
  mobile: string;
  bio: string;
  isSocial: boolean;
  gamerProfile: UserGamerProfile;
  idProof: UserIdProof;
  address: UserAddress;
  wallet: {
    coins: number;
    shopCoins: number;
  };
  dob: Date;
  activity: UserActivity;
  role: UserRole;
  settings: UserSettings;
  recovery: UserRecovery;
  tournaments: Array<{
    id: string;
    didWin: boolean;
    coins: number;
    name: string;
    startDateTime: Date;
    endDateTime: Date;
    game: string;
  }>;
  phone: string;
  isSuperAdmin: string;
  fcmToken: string;
  cart: Array<UserCart>;
}
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    ughId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    isSocial: {
      type: Boolean,
      default: false,
    },
    password: String,
    uploadUrl: String,
    mobile: String,
    isSuperAdmin: String,
    bio: String,
    fcmToken: String,
    gamerProfile: {
      psnId: String,
      gamerTag: String,
      steamId: String,
    },
    idProof: {
      aadharCard: String,
      aadharUrl: String,
      panUrl: String,
      panCard: String,
    },
    address: {
      country: String,
      state: String,
    },
    wallet: {
      coins: {
        type: Number,
        default: 0,
      },
      shopCoins: {
        type: Number,
        default: 0,
      },
    },
    tournaments: [
      {
        id: String,
        didWin: {
          type: Boolean,
          default: false,
        },
        coins: Number,
        name: String,
        startDateTime: Date,
        endDateTime: Date,
        game: String,
      },
    ],
    dob: mongoose.Schema.Types.Date,
    activity: {
      enum: Object.values(UserActivity),
      type: String,
      default: UserActivity.Inactive,
    },
    role: {
      enum: Object.values(UserRole),
      type: String,
      default: UserRole.Player,
    },
    settings: {
      newTournamentWasAdded: {
        type: Boolean,
        default: true,
      },
      addedTournamentWasWon: {
        type: Boolean,
        default: false,
      },
      addedTournamentWillStart: {
        type: Boolean,
        default: false,
      },
      addedTournamentProofSent: {
        type: Boolean,
        default: false,
      },
      addedTournamentProofDenied: {
        type: Boolean,
        default: false,
      },
      activityInCreatedTournament: {
        type: Boolean,
        default: false,
      },
    },
    recovery: {
      key: String,
      by: mongoose.Schema.Types.Date,
    },
    cart: [
      {
        imageUrl: String,
        qty: Number,
        value: Number,
        name: String,
        size: String,
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  return new User(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>("Users", userSchema);
