import { BadRequestError, UserActivity } from "@monsid/ugh-og"
import { Request, Response } from "express";
import { User } from "../../models/user";

export const userFetchMobileController = async (req: Request, res: Response) => {
    const { ughId } = req.params;
    const user = await User.findOne({ ughId }).select("mobile ughId activity");
    if (user.activity !== UserActivity.Inactive) throw new BadRequestError("Account already active/banned. Kindly contact Admin.")
    res.send(user);
};
