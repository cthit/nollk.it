import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getAllCommittee(req: NextApiRequest, res: NextApiResponse) {
  const committees = await prisma.committee.findMany();
  res.json(committees);
}