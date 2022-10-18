import { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import cookie from "cookie"

export default async function login(req: NextApiRequest, res: NextApiResponse) {

  const TOKEN_EXPIRATION = 3600 // Time in seconds

  if (!req.body.password) {
    res.status(400).json({ error: "Bad request" })
    return
  }

  if (!process.env.PASSWORD) {
    res.status(500).json({ error: "Missing environment variable" })
    return
  }

  if (req.body.password !== process.env.PASSWORD) {
    res.status(400).json({ error: "Wrong password" })
    return
  }

  const token = jwt.sign({}, process.env.PASSWORD, { expiresIn: TOKEN_EXPIRATION + "s" })

  const serialized = cookie.serialize("token", token, {
    httpOnly: true,
    maxAge: TOKEN_EXPIRATION,
    sameSite: "strict",
    path: "/",
  })

  res.setHeader("Set-Cookie", serialized)
  res.status(200).send( { message: "Logged in. Token set." } )
}