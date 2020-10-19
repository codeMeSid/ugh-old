import { Request, Response } from "express";
import { User, UserDoc } from "../../models/user";
import { BadRequestError, UserActivity, isValidDob, filter } from "@monsid/ugh";

// TODO check for valid aadhar card
export const updateUserController = async (req: Request, res: Response) => {
  let isSocialActive = false;
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
    uploadUrl,
  } = req.body;
  const user = await User.findById(id);

  if (!user) throw new BadRequestError("Invalid account");
  if (uploadUrl) {
    user.uploadUrl = uploadUrl;
  }
  if (dob) {
    isValidDob(dob);
    user.dob = dob;
  }
  if (aadharCard) {
    filter.isUnfit({ aadharCard });
    user.idProof.aadharCard = aadharCard;
  }
  if (panCard) {
    filter.isUnfit({ panCard });
    user.idProof.panCard = panCard;
  }
  if (aadharUrl) {
    user.idProof.aadharUrl = aadharUrl;
  }
  if (panUrl) {
    user.idProof.panUrl = panUrl;
  }
  if (psnId) {
    filter.isUnfit({ psnId });
    user.gamerProfile.psnId = psnId;
  }
  if (gamerTag) {
    filter.isUnfit({ gamerTag });
    user.gamerProfile.gamerTag = gamerTag;
  }
  if (steamId) {
    filter.isUnfit({ steamId });
    user.gamerProfile.steamId = steamId;
  }
  if (mobile) {
    filter.isUnfit({ mobile });
    user.mobile = mobile;
  }
  if (bio) {
    filter.isUnfit({ bio });
    user.bio = bio;
  }
  if (country) {
    user.address.country = country;
  }
  if (state) {
    user.address.state = state;
  }
  if (user.isSocial && user.activity === UserActivity.Inactive) {
    if (dob) {
      isValidDob(dob);
      isSocialActive = true;
      user.activity = UserActivity.Active;
      user.wallet.coins = 250;
    }
  }
  await user.save();
  res.send(isSocialActive);
};
