import { NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";
import { prisma } from '../../../../prisma/prismaclient'

export default async function add(req: NextApiRequest, res: NextApiResponse) {

  const {payload} = await jose.jwtVerify(req.cookies.token || "", new TextEncoder().encode(process.env.PASSWORD))

  if (!payload) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

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