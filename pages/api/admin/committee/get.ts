import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../../prisma/prismaclient'

export default async function getAllCommittee(req: NextApiRequest, res: NextApiResponse) {
  const committees = await prisma.committee.findMany();
  res.json(committees);
}