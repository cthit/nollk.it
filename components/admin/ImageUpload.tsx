import { useState, useEffect } from "react"
import { hasImage } from "../../util"
import Image from "next/image"

interface ImageUploadProps {
  title: string
  url: string
  type: ".png" | ".jpg,.jpeg"
}

export default function ImageUpload({ title, url, type }: ImageUploadProps) {

  const [fullURL, setFullURL] = useState("/bilder/" + url)

  const [isImage, setIsImage] = useState(false)

  useEffect(() => {
    (async () => {
      setIsImage(await hasImage(fullURL))
    })()
  }, [fullURL])

  useEffect(() => {
    setFullURL("/bilder/" + url)
  }, [url])

  const isFile = (maybeFile: File | undefined | null): maybeFile is File => {
    return maybeFile !== null && maybeFile !== undefined
  }

  return (
    <div className="aspect-square border border-white rounded-lg overflow-hidden relative flex flex-col justify-end bg-black/20 hover:bg-black/0 transition duration-200">
      <label className="w-full h-full appearance-none outline-none z-10 cursor-pointer">
        <input type="file" accept={type} className="hidden" onChange={async (e) => {
          const maybeFile = e.target.files?.item(0)

          if (isFile(maybeFile)) {
            await uploadImage(url, maybeFile)
            const rand = Math.random()
            setFullURL("/bilder/" + url + "?" + rand) //rand is needed for the image to update, otherwise the browser keeps the url cached
          } else {
            console.error("No file")
          }
        }} />
      </label>
      {isImage ? (
        <Image src={fullURL} alt={title} layout={"fill"} className="-z-10 absolute object-cover h-full" />
      ) : (
        <div className="absolute top-1 left-2 text-xs italic">Bild saknas</div>
      )}
      <div className="absolute bg-gradient-to-t from-black to-black/0 h-1/3 w-full">
        <div className="absolute bottom-1 left-2">{title}</div>
      </div>
    </div>
  )
}

const uploadImage = async (url: string, file: File) => {

  if (file.size > 1_500_000) return alert("Bilden är för stor, max 1,5 MB")

  const formData = new FormData()
  formData.append('file', file)
  formData.append('url', url)

  const res = await fetch("/api/admin/uploadImage", {
    method: "POST",
    body: formData,
  })
}