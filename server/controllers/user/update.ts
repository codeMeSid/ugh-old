import { Request, Response } from "express";
import { User, UserDoc } from "../../models/user";
import { BadRequestError, UserActivity, isValidDob, filter } from "@monsid/ugh";

// TODO check for valid aadhar card
export const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.currentUser;
  const {
    dob,
    aadharCard,
    psnId,
    gamerTag,
    steamId,
    mobile,
    panCard,
    bio,
    aadharUrl,
    panUrl,
    country,
    state,
  } = req.body;

  let userObj = {} as UserDoc;

  if (dob) {
    isValidDob(dob);
    userObj.dob = dob;
  }
  if (aadharCard) {
    filter.isUnfit({ aadharCard });
    userObj.idProof.aadharCard = aadharCard;
  }
  if (panCard) {
    filter.isUnfit({ panCard });
    userObj.idProof.panCard = panCard;
  }
  if (aadharUrl) {
    userObj.idProof.aadharUrl = aadharUrl;
  }
  if (panUrl) {
    userObj.idProof.panUrl = panUrl;
  }
  if (psnId) {
    filter.isUnfit({ psnId });
    userObj.gamerProfile.psnId = psnId;
  }
  if (gamerTag) {
    filter.isUnfit({ gamerTag });
    userObj.gamerProfile.gamerTag = gamerTag;
  }
  if (steamId) {
    filter.isUnfit({ steamId });
    userObj.gamerProfile.steamId = steamId;
  }
  if (mobile) {
    filter.isUnfit({ mobile });
    userObj.mobile = mobile;
  }
  if (bio) {
    filter.isUnfit({ bio });
    userObj.bio = bio;
  }
  if (country) {
    userObj.address.country = country;
  }
  if (state) {
    userObj.address.state = state;
  }

  const user = await User.findById(id);
  if (!user) throw new BadRequestError("Invalid account");
  if (user.isSocial && user.activity === UserActivity.Inactive) {
    if (aadharCard && aadharUrl && dob) {
      isValidDob(dob);
      filter.isUnfit({ aadharCard });
      userObj.activity = UserActivity.Active;
      userObj.wallet.coins = 250;
    }
  }
  user.set(userObj.toObject());
  await user.save();
  res.send(user);
};
