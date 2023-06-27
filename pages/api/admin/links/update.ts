import { NextApiRequest, NextApiResponse } from "next";
import { Links } from "@prisma/client";
import * as jose from "jose";
import { prisma } from '../../../../prisma/prismaclient'

export default async function update(req: NextApiRequest, res: NextApiResponse) {

  const {payload} = await jose.jwtVerify(req.cookies.token || "", new TextEncoder().encode(process.env.PASSWORD))

  if (!payload) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const links: Links[] = req.body
  const deletedLinks = await prisma.links.deleteMany({
    where: {
      NOT: {
        id: {
          in: links.map(link => link.id)
        }
      }
    }
  })
  const updateLinks = await Promise.all(links.map(async (link) => {
    return await prisma.links.upsert({
      where: {
        id: link.id
      },
      update: {
        url: link.url
      },
      create: {
        id: link.id,
        url: link.url
      }
    })
  }))
    
  res.json(updateLinks)
}
