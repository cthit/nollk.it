import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { CommitteeWithMembers } from "../../../../types";

const prisma = new PrismaClient();

export default async function add(req: NextApiRequest, res: NextApiResponse) {

  const committee: CommitteeWithMembers = req.body
  const membersWithoutYear = committee.members.map((member) => { 
    const { year, ...memberWithoutYear } = member
    return memberWithoutYear
  })

  const insertCommittee = await prisma.committee.create({
    data: {
      year: committee.year,
      firstDay: committee.firstDay,
      fontURL: committee.fontURL,
      orderInImageDesc: committee.orderInImageDesc,
      members: {
        create: membersWithoutYear
      }
    },
  })

  res.json(insertCommittee);
}