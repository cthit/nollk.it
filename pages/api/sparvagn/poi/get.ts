import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../../prisma/prismaclient'

export default async function update(req: NextApiRequest, res: NextApiResponse) {

  const allPois = await prisma.poi.findMany()
  res.json(allPois)
}
