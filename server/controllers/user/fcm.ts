import { BadRequestError } from "@monsid/ugh-og";
import { Request, Response } from "express";
import { User } from "../../models/user";

export const userFcmController = async (req: Request, res: Response) => {
    const { fcmToken } = req.body;
    const { id } = req.currentUser;
    const user = await User.findById(id);
    if (!user) throw new BadRequestError("Invalid user");
    user.fcmToken = fcmToken;
    await user.save();
    res.send(true);
}