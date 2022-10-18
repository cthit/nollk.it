import { NextRequest, NextResponse } from 'next/server'
import * as jose from "jose"

export async function middleware(req: NextRequest) {

  if (req.nextUrl.pathname.startsWith("/admin")) {
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
}