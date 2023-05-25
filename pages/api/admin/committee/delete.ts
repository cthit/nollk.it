import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function add(req: NextApiRequest, res: NextApiResponse) {

  const year = req.body.year

  const deleteMembers = prisma.member.deleteMany({
    where: {
      year: year
    },
  })
  
  const deleteCommittee = prisma.committee.delete({
    where: {
      year: year
    },
  })
  
  const transaction = await prisma.$transaction([deleteMembers, deleteCommittee])

  res.json(transaction);
}