import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.$connect()

  await prisma.links.create({
    data: {
      version: 0,
      deklarationURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      phaddringURL: "https://www.youtube.com/watch?v=fTFxE32onKs",
      calendarURLs: [
        "https://calendar.google.com/calendar/ical/71hb815m1g75pje527e7stt240%40group.calendar.google.com/public/basic.ics",
        "https://calendar.google.com/calendar/ical/m60j18stkosv9g9o2jf2t7b080%40group.calendar.google.com/public/basic.ics",
      ]
    }
  })
}

main().catch((e) => {
  throw e
}).finally(async () => {
  console.log('Query completed, now disconnecting.')
  await prisma.$disconnect()
})