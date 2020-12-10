import { Request, Response } from "express";
import { Passbook } from "../../models/passbook";

export const passbookFetchAllController = async (req: Request, res: Response) => {
    const passbook = await Passbook.find().sort({ date: -1 });
    res.send(passbook);
}