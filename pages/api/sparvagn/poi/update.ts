import { NextApiRequest, NextApiResponse } from "next";
import { Poi } from "@prisma/client";
import * as jose from "jose";
import { prisma } from '../../../../prisma/prismaclient'

export default async function update(req: NextApiRequest, res: NextApiResponse) {

  const {payload} = await jose.jwtVerify(req.cookies.sparvagn_token || "", new TextEncoder().encode(process.env.SPARVAGN_PASSWORD))

  if (!payload) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const pois: Poi[] = req.body
    const deletedPois = await prisma.poi.deleteMany({
        where: {
            NOT: {
                id: {
                    in: pois.map(poi => poi.id)
                }
            }
    }
    })

    const updatePois = await Promise.all(pois.map(async (poi) => {
        return await prisma.poi.upsert({
            where: {
                id: poi.id
            },
            update: {
                name: poi.name,
                lat: poi.lat,
                lng: poi.lng,
                score: poi.score,
                geoFenceDistance: poi.geoFenceDistance,
                taskName: poi.taskName,
                fullTask: poi.fullTask,
                nearestStop: poi.nearestStop,
                transportMode: poi.transportMode,
            },
            create: {
                id: poi.id,
                name: poi.name,
                lat: poi.lat,
                lng: poi.lng,
                score: poi.score,
                geoFenceDistance: poi.geoFenceDistance,
                taskName: poi.taskName,
                fullTask: poi.fullTask,
                nearestStop: poi.nearestStop,
                transportMode: poi.transportMode,
            }
        })
    }))
  
    
  res.json(updatePois)
}
