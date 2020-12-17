import { Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError, isValidDob } from "@monsid/ugh";
import { filter } from "../../utils/profanity-filter";

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
  isValidDob(dob);
  filter.isUnfit({ aadharCard });
  filter.isUnfit({ panCard });
  filter.isUnfit({ psnId });
  filter.isUnfit({ gamerTag });
  filter.isUnfit({ steamId });
  filter.isUnfit({ mobile });
  filter.isUnfit({ bio });
  user.uploadUrl = uploadUrl;
  user.dob = dob;
  user.idProof.aadharCard = aadharCard;
  user.idProof.panCard = panCard;
  user.idProof.aadharUrl = aadharUrl;
  user.idProof.panUrl = panUrl;
  user.gamerProfile.psnId = psnId;
  user.gamerProfile.gamerTag = gamerTag;
  user.gamerProfile.steamId = steamId;
  user.mobile = mobile;
  user.bio = bio;
  user.address.country = country;
  user.address.state = state;
  await user.save();
  res.send(isSocialActive);
};
