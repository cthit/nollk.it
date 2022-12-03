import { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"

export default async function upload(req: NextApiRequest, res: NextApiResponse) {

  // TODO check if the user is logged in

  console.log("Upload time!")
  console.log(req.body)

  //const file: File = req.body.file
  /* convert file to uploadable format */
  //const buffer = new FileReader.readAsArrayBuffer(file)


  //console.log(file)
  //fs.writeFile(`/public/${req.body.name}`, file, err => console.log(err))

  return res.status(200).send({ message: req.body })
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '200mb',
    },
  },
}