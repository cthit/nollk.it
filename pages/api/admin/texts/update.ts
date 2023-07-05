import { NextApiRequest, NextApiResponse } from "next";
import { PageText } from "@prisma/client";
import * as jose from "jose";
import { prisma } from '../../../../prisma/prismaclient'

export default async function update(req: NextApiRequest, res: NextApiResponse) {

  const {payload} = await jose.jwtVerify(req.cookies.token || "", new TextEncoder().encode(process.env.PASSWORD))

  if (!payload) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  //update each text in the body
  const pageTexts: PageText[] = req.body
  const updateTexts = await Promise.all(pageTexts.map(async (text) => {
    return await prisma.pageText.update({
      where: {
        page: text.page
      },
      data: {
        content: text.content
      }
    })
  }))
    
  res.json(updateTexts)
}
