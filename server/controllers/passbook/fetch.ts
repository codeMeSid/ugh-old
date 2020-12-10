import { Request, Response } from "express";
import { Passbook } from "../../models/passbook";

export const passbookFetchController = async (req: Request, res: Response) => {

    const { ughId } = req.currentUser
    const passbook = await Passbook.find({ ughId }).sort({ date: -1 });
    res.send(passbook);
}