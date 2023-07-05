import type { NextPage } from 'next'
import Page from '../components/Page'
import ical from 'node-ical'
import { prisma } from '../prisma/prismaclient'

/*
  To get FullCalendar working with Next we install 'next-transpile-modules' to fix CSS loading issues
*/
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import momentPlugin from '@fullcalendar/moment'
import React, { useContext } from 'react'
import YearContext from '../util/YearContext'

export const getServerSideProps = async () => {


  const calenderLinks = await prisma.links.findMany(
    {
      where: {
        id: {
          startsWith: "_kalender"
        }
      }
    }
  )

  const calendarEvents = await Promise.all(calenderLinks.map(async calenderLink => {
    return await ical.async.fromURL(calenderLink.url)
    .catch(() => {
      return { error: "Failed to fetch calendar from the following URL: " + calenderLink.url }
    })
  }))

  const stringifiedCalendars = calendarEvents.map(events => JSON.stringify(events))

  return {
    props: { stringifiedCalendars: stringifiedCalendars, firstdayDates: (await prisma.committee.findMany()).map(c => c.firstDay ?? "").filter(d => d) }
  }
}

interface SchemaProps {
  stringifiedCalendars: string[],
  firstdayDates: string[],
}

interface CalendarEvent {
  start: string,
  end: string,
  title: string,
  backgroundColor: string,
}

const Schema: NextPage<SchemaProps> = ({ stringifiedCalendars, firstdayDates }) => {

  const calendarColors = [
    "#0bb", // turquoise
    "#0b4", // green
    "#b03", // red
    "#bb0", // yellow
    "#50b", // purple
    "#b40", // orange
  ]

  let allEvents: CalendarEvent[] = []

  stringifiedCalendars.forEach((calendar, index) => {

    const events = JSON.parse(calendar)

    for (const key in events) {

      const event = events[key]

      if (event.type !== "VEVENT") continue

      allEvents.push({
        start: event.start.toString().split(".")[0],
        end: event.end.toString().split(".")[0],
        title: event.summary,
        backgroundColor: calendarColors[index % calendarColors.length],
      })
    }
  })

  const calendarRef = React.useRef<FullCalendar>(null)

  const ctx = useContext(YearContext)

  const getFirstDayDate = (year: string): string => {
    return firstdayDates.find(d => d.includes(year)) ?? firstdayDates.find(d => d.includes(new Date().getFullYear().toString())) ?? ""
  }

  return (
    <>
      <Page blackout>
        <div className="my-32 w-full">
          <FullCalendar
            plugins={[timeGridPlugin, momentPlugin]}
            ref={calendarRef}
            locale={"sv"}
            events={allEvents}
            dayHeaderFormat={"D/M"}
            allDaySlot={false}
            slotMinTime={"07:00:00"}
            slotMaxTime={"28:00:00"}
            slotDuration={"01:00:00"}
            slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
            eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
            firstDay={1}
            contentHeight={"auto"}
            nowIndicator={true}
            headerToolbar={{ left: "title", center: "", right: `prev,today,${getFirstDayDate(ctx.year) ? "firstdayButton," : ""}next` }}
            titleFormat={{ year: "numeric", month: 'long' }}
            buttonIcons={{ prev: "chevron-left", next: "chevron-right" }}
            buttonText={{ today: "Idag" }}
            buttonHints={{ prev: "Föregående vecka", today: "Hoppa till idag", next: "Nästa vecka" }}
            customButtons={{
              firstdayButton: {
                text: "Första dagen",
                hint: "Hoppa till mottagningens första dag",
                click: () => {
                  if (getFirstDayDate(ctx.year)) {
                    calendarRef.current?.getApi().gotoDate(getFirstDayDate(ctx.year))
                  }
                }
              }
            }}
          />
        </div>
      </Page>
    </>
  )
}

export default Schema