import { NextRequest, NextResponse } from 'next/server'
import * as jose from "jose"
import { Links } from '@prisma/client'

export async function middleware(req: NextRequest) {

  const urlIs = (url: string) => req.nextUrl.pathname.startsWith(url)

  if (urlIs("/admin") /*|| urlIs("/api/admin")*/) {
    const token = req.cookies.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (!process.env.PASSWORD) {
      return NextResponse.json({ error: "Missing environment variable" }, { status: 500 })
    }

    try {
      await jose.jwtVerify(token, new TextEncoder().encode(process.env.PASSWORD))

      return NextResponse.next()
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  }

  const result = await fetch(req.nextUrl.origin + "/api/admin/links/get", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  const foundLink = (await result.json()).find( (link: Links) => urlIs("/" + link.id))

  if (foundLink) {
    return NextResponse.redirect(new URL(foundLink.url))
  }

  return NextResponse.next()
}