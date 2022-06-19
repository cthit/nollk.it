import type { NextPage } from 'next'
import Head from 'next/head'
import ical from 'node-ical'
import Page from '../components/Page'
import Countdown from '../components/Countdown'
import ToDo from '../components/ToDo'

export const getServerSideProps = async () => {

  const MOTTAGNING_EVENTS_URL = "https://calendar.google.com/calendar/ical/71hb815m1g75pje527e7stt240%40group.calendar.google.com/public/basic.ics"

  const mottagningEvents = await ical.async.fromURL(MOTTAGNING_EVENTS_URL)

  return {
    props: { unparsedEvents: JSON.stringify(mottagningEvents) }
  }
}

interface IndexProps {
  unparsedEvents: string,
}

const Index: NextPage<IndexProps> = ( { unparsedEvents } ) => {
  return (
    <>
      <Head>
        <title>NollKIT - Mottagningskommittén inom Teknologsektionen Informationsteknik</title>
        <meta name="description" content="Varje år arrangerar vi mottagning för IT-sektions 140 nya studenter" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Page>
        <div className="mt-12 flex flex-col gap-6 items-center lg:flex-row lg:mt-24 lg:gap-[20vw]">
          <Countdown />
          <ToDo unparsedEvents={ unparsedEvents } />
        </div>
      </Page>
    </>
  )
}

export default Index
