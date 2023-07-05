import { NextApiRequest, NextApiResponse } from "next";
import { CommitteeWithMembers } from "../../../../types";
import * as jose from "jose";
import { prisma } from '../../../../prisma/prismaclient'

export default async function add(req: NextApiRequest, res: NextApiResponse) {

  const {payload} = await jose.jwtVerify(req.cookies.token || "", new TextEncoder().encode(process.env.PASSWORD))

  if (!payload) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const committee: CommitteeWithMembers = req.body
  const membersWithoutYear = committee.members.map((member) => { 
    const { year, ...memberWithoutYear } = member
    return memberWithoutYear
  })

  const insertCommittee = await prisma.committee.create({
    data: {
      year: committee.year,
      firstDay: committee.firstDay,
      orderInImageDesc: committee.orderInImageDesc,
      members: {
        create: membersWithoutYear
      }
    },
  })

  res.json(insertCommittee);
}
