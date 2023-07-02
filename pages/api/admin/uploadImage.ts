import { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"
import fs from "fs"
import * as jose from "jose";

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function upload(req: NextApiRequest, res: NextApiResponse) {

  const {payload} = await jose.jwtVerify(req.cookies.token || "", new TextEncoder().encode(process.env.PASSWORD))

  if (!payload) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {

    const imgPath = fields.url as string

    const startsWithYear = /^\d{4}/
    if (!startsWithYear.test(imgPath)) return console.log("Path is missing year")

    const file = files.file as formidable.File

    const directoryPath = ("public/bilder/" + imgPath).split('/').slice(0, -1).join('/')
    console.log(directoryPath)
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true })
    }

    const readStream = fs.createReadStream(file.filepath)
    const writeStream = fs.createWriteStream("public/bilder/" + imgPath)

    readStream.pipe(writeStream)
    writeStream.on('finish', () => {
      console.log("Saved image!")
    })
  })

  return res.status(200).send({ message: "Victory!" })
}