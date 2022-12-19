import { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"

export default async function upload(req: NextApiRequest, res: NextApiResponse) {

  // TODO check if the user is logged in

  console.log("Upload time!")
  //console.log(req.body)

  const form = new formidable.IncomingForm()
  let parsed = await form.parse(req, (err, fields, files) => {
    if (err) return console.error(err)
    return { fields, files }
  })
  console.log("parsed" + parsed)
  console.log("fields" + parsed.fields)

  //const file: File = req.body.file
  /* convert file to uploadable format */
  //const buffer = new FileReader.readAsArrayBuffer(file)


  //console.log(file)
  //fs.writeFile(`/public/${req.body.name}`, file, err => console.log(err))

  return res.status(200).send({ message: "Victory!" })
}

export const config = {
  api: {
    bodyParser: false,
  },
}