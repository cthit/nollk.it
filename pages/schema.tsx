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
          <style>
            {`
              /* -------------------------------- */
              /* --- Styling for FullCalendar --- */
              /* -------------------------------- */

              /* Background shading of current day */
              .fc .fc-timegrid-col.fc-day-today {
                background-color: hsla(0, 0%, 100%, 0.07);
              }

              /* Hours on the left side of the calendar */
              .fc .fc-timegrid-slot-label-cushion {
                vertical-align: middle;
                padding-left: 10px;
                padding-right: 10px;
                font-size: 10px;
              }

              /* Transparent borders */
              .fc th, .fc td {
                border: 1px solid hsla(0, 0%, 100%, 0.1);
              }

              /* Transparent borders */
              .fc-theme-standard .fc-scrollgrid {
                border: none;
                border-top: 1px solid hsla(0, 0%, 100%, 0.1);
                border-left: 1px solid hsla(0, 0%, 100%, 0.1);
              }

              /* Transparent borders */
              .fc-theme-standard td {
                border: 1px solid hsla(0, 0%, 100%, 0.1);
              }

              /* Buttons in the top right */
              .fc .fc-button-group > .fc-button {
                background-color: hsla(0, 0%, 100%, 0);
                border: none;
                text-align: center;
              }

              /* Buttons in the top right on hover */
              .fc .fc-button-group > .fc-button:hover {
                background-color: hsla(0, 0%, 0%, 0.2);
              }

              /* Buttons in the top right on click */
              .fc .fc-button-group > .fc-button:active {
                background-color: hsla(0, 0%, 0%, 0.4);
              }

              /* Buttons in the top right don't give feedback on hover when disabled */
              .fc .fc-button-primary:disabled:hover {
                background-color: hsla(0, 0%, 0%, 0);
              }

              /* Buttons in top right don't show focus selection box */
              .fc .fc-button-primary {
                box-shadow: none !important;
              }

              /* Distance between calendar and buttons */
              .fc .fc-toolbar.fc-header-toolbar {
                margin-bottom: 16px;
              }

              /* Current time indicator line */
              .fc .fc-timegrid-now-indicator-line {
                border: none;
                border-bottom: 2px solid rgba(255, 255, 255, 0.8);
              }

              /* Hides current time indicator arrow */
              .fc .fc-timegrid-now-indicator-arrow {
                display: none;
              }

              /* Toolbar title styling */
              .fc .fc-toolbar-title {
                font-size: 1.25rem;
                font-style: italic;
                text-transform: capitalize;
              }

              /* Calendar event blocks */
              .fc-timegrid-event .fc-event-main {
                padding: 2px 4px 0;
              }

              /* Remove outer border from calendar events */
              .fc-timegrid-event-harness-inset .fc-timegrid-event {
                box-shadow: none;
              }

              /* Remove inner event border */
              .fc-v-event {
                border: none;
              }

              /* Height of each hour */
              .fc .fc-timegrid-slot-label {
                height: 30px;
              }

              /* Event time */
              .fc-timegrid-event .fc-event-time {
                font-size: 8px;
                white-space: break-spaces;
              }

              /* Event title */
              .fc-v-event .fc-event-title-container {
                font-size: 10px;
                font-weight: bold;
                margin-top: -2px;
              }

              /* Decreases size of day/month numbers on mobile */
              @media (max-width: 1024px) {
                /*  */
                .fc .fc-col-header-cell-cushion {
                  font-size: 10px;
                }

                /* Event time */
                .fc-timegrid-event .fc-event-time {
                  font-size: 7px;
                }

                /* Event title */
                .fc-v-event .fc-event-title-container {
                  font-size: 8px;
                  font-weight: bold;
                  margin-top: -2px;
                }
              }
            `}
          </style>
        </div>
      </Page>
    </>
  )
}

export default Schema