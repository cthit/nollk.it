import { NextApiRequest, NextApiResponse } from "next";
import { Links, PrismaClient } from "@prisma/client";
import * as jose from "jose";

const prisma = new PrismaClient();

export default async function update(req: NextApiRequest, res: NextApiResponse) {

  const {payload} = await jose.jwtVerify(req.cookies.token || "", new TextEncoder().encode(process.env.PASSWORD))

  if (!payload) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const links: Links[] = req.body
  const updateLinks = await Promise.all(links.map(async (link) => {
    return await prisma.links.update({
      where: {
        id: link.id
      },
      data: {
        url: link.url
      }
    })
  }))
    
  res.json(updateLinks)
}
