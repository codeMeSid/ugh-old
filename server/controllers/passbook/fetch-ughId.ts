import { Request, Response } from "express";
import { Passbook } from "../../models/passbook";

export const passbookUserController = async (req: Request, res: Response) => {
    const { ughId } = req.params;
    const passbooks = await Passbook.find({ ughId }).sort({ date: -1 });
    res.send(passbooks);
}