import { Request, Response } from "express";

const roles = ['general_staff', 'ot_staff', 'pharmacy_staff', 'admin'];

export default function roleHandler(req: Request, res: Response) {
  if (req.method === 'GET') {
    return res.status(200).json({ roles });
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
