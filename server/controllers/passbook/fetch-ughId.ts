import { Request, Response } from "express";
import { Passbook } from "../../models/passbook";

export const passbookUserController = async (req: Request, res: Response) => {
    const { ughId } = req.params;
    const passbooks = await Passbook.find({ ughId });
    res.send(passbooks.reverse());
}