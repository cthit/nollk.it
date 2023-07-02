import { NextApiRequest, NextApiResponse } from "next";
import { TimeLineEvent } from "@prisma/client";
import * as jose from "jose";
import { prisma } from '../../../../prisma/prismaclient'

export default async function update(req: NextApiRequest, res: NextApiResponse) {

  const { payload } = await jose.jwtVerify(req.cookies.token || "", new TextEncoder().encode(process.env.PASSWORD))

  if (!payload) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const timelineEvents: TimeLineEvent[] = req.body.events
  const year: number = req.body.year
  const deletedEvents = await prisma.timeLineEvent.deleteMany({
    where: {
      AND: [
        {
          year: year.toString()
        },
        {
          NOT: {
            id: {
              in: [...timelineEvents].map(event => event.id)
            }
          }
        }
      ]
    }
  })
  const updateTimeline = await Promise.all(timelineEvents.map(async (events) => {
    return await prisma.timeLineEvent.upsert({
      where: {
        id: events.id
      },
      update: {
        date: events.date,
        text: events.text,
        year: events.year,
        categoryId: events.categoryId,
        link: events.link,
      },
      create: {
        date: events.date,
        text: events.text,
        year: events.year,
        categoryId: events.categoryId,
        link: events.link,
      }
    })
  }))

  res.json(updateTimeline)
}
