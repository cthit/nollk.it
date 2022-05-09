import type { NextPage } from 'next'
import Head from 'next/head'
import Page from '../components/Page'

/*
  To get FullCalendar working with Next we install 'next-transpile-modules' to fix CSS loading issues
*/
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useState } from 'react'


const Schema: NextPage = () => {

  // Can't set locale directly, causes hydration error
  const [locale, setLocale] = useState("")
  useEffect(() => setLocale("se"), [])

  const mottagning = [
    { start: '2022-05-10T09:30', end: '2022-05-10T14:45', title: 'EPIC GAMER TESTEVENT' },
    { start: '2022-08-16T09:30', end: '2022-08-16T14:45', title: 'Första dagen' },
    { start: '2018-08-18T15:30', end: '2018-08-18T19:15', title: 'Bricktillverkning' },
    { start: '2018-08-19T17:01', end: '2018-08-19T21:00', title: 'sexIT Gasque' },
  ].map( e => {
    return {
      ...e, 
      backgroundColor: "rgba(0,0,0,0.7)",
      borderColor: "#09cdda"
    }
  })

  const introcourses = [
    { start: '2022-05-10T11:30', end: '2022-05-10T17:45', title: 'tråkig introkurs' },
  ].map( e => {
    return {
      ...e, 
      backgroundColor: "rgba(0,0,0,0.7)",
      borderColor: "#0f0"
    }
  })

  const allEvents = [...mottagning, ...introcourses ]

  return (
    <>
      <Head>
        <title>Schema</title>
        <meta name="description" content="Här finns schemat, både för " />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Page blackout>
        <div className="w-10/12 h-1/3 pl-[17%] pt-24">
          <FullCalendar
            plugins={[ timeGridPlugin ]}
            events={ allEvents }
            dayHeaderFormat={ { month: "numeric", day: "numeric" } }
            locale={ locale }
            allDaySlot={false}
            slotMinTime={ "07:00:00" }
            slotMaxTime={ "28:00:00" }
            slotDuration={ "01:00:00" }
            slotLabelFormat={ { hour: "2-digit", minute: "2-digit" } }
            firstDay={1}
            contentHeight={"auto"}
            nowIndicator={true}
            headerToolbar={ { left: "", center:"", right: "prev,today,next" } }
            buttonIcons={ { prev: "chevron-left", next: "chevron-right" } }
            buttonText={ { today: "Idag" } }
            buttonHints={ {prev: "Föregående vecka", today: "Hoppa till idag", next: "Nästa vecka"} }
          />
        </div>
      </Page>
    </>
  )
}

export default Schema