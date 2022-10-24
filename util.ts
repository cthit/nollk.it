/*a function that looks in a url and returns wether that adress leads to an image or if the adress returns 404*/

export async function hasImage(url: string) {
  const res = await fetch(url)
  const contentType = res.headers.get("content-type")
  console.log(res)
  return contentType?.startsWith("image/") ?? false
}
