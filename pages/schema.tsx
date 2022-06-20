import type { NextPage } from 'next'
import Head from 'next/head'
import Page from '../components/Page'
import ical from 'node-ical'

/*
  To get FullCalendar working with Next we install 'next-transpile-modules' to fix CSS loading issues
*/
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import momentPlugin from '@fullcalendar/moment'

export const getServerSideProps = async () => {

  // Make sure calendar is public!! Otherwise you get a 404 error
  const MOTTAGNING_EVENTS_URL = "https://calendar.google.com/calendar/ical/71hb815m1g75pje527e7stt240%40group.calendar.google.com/public/basic.ics"
  const INTROCOURSE_EVENTS_URL = "https://calendar.google.com/calendar/ical/m60j18stkosv9g9o2jf2t7b080%40group.calendar.google.com/public/basic.ics"


  const mottagningEvents = await ical.async.fromURL(MOTTAGNING_EVENTS_URL)
  const introcourseEvents = await ical.async.fromURL(INTROCOURSE_EVENTS_URL)

  return {
    // stringify because Next complains about serialization otherwise
    props: { unparsedCalendars: [JSON.stringify(mottagningEvents), JSON.stringify(introcourseEvents)] }
  }
}

interface SchemaProps {
  unparsedCalendars: string[],
}

interface CalendarEvent {
  start: string,
  end: string,
  title: string,
  backgroundColor: string,
}

const Schema: NextPage<SchemaProps> = ({ unparsedCalendars }) => {

  const calendarColors = [
    "#0bb", // turquoise
    "#0b4", // green
    "#b03", // red
    "#bb0", // yellow
    "#50b", // purple
    "#b40", // orange
  ]

  let allEvents: CalendarEvent[] = []

  unparsedCalendars.forEach((calendar, index) => {

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

  return (
    <>
      <Head>
        <title>Schema</title>
        <meta name="description" content="Här finns schemat, både för mottagningen och introkurserna" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page blackout>
        <div className="my-4 h-1/5 w-full">
          <FullCalendar
            plugins={[timeGridPlugin, momentPlugin]}
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
            headerToolbar={{ left: "", center: "", right: "prev,today,next" }}
            buttonIcons={{ prev: "chevron-left", next: "chevron-right" }}
            buttonText={{ today: "Idag" }}
            buttonHints={{ prev: "Föregående vecka", today: "Hoppa till idag", next: "Nästa vecka" }}
          />
        </div>
      </Page>
    </>
  )
}

export default Schema