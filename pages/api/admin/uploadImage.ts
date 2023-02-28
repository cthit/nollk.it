import { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"
import fs from "fs"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function upload(req: NextApiRequest, res: NextApiResponse) {

  // TODO check if the user is logged in

  const form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {

    const imgPath = fields.url as string

    const startsWithYear = /^\d{4}/
    if (!startsWithYear.test(imgPath)) return console.log("Path is missing year")

    const file = files.file as formidable.File

    const readStream = fs.createReadStream(file.filepath)
    const writeStream = fs.createWriteStream("public/bilder/" + imgPath)

    readStream.pipe(writeStream)
    writeStream.on('finish', () => {
      console.log("Saved image!")
    })
  })

  return res.status(200).send({ message: "Victory!" })
}