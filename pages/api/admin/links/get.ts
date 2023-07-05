import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../../prisma/prismaclient'

export default async function update(req: NextApiRequest, res: NextApiResponse) {

  const allLinks = await prisma.links.findMany(
    {
      where: {
        id: {
          not: {
            startsWith: "_"
          }
        }
      }    
    }
  )

  res.json(allLinks)
}
