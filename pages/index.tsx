import type { NextPage } from 'next'
import Head from 'next/head'
import ical from 'node-ical'
import Page from '../components/Page'
import Countdown from '../components/Countdown'
import ToDo from '../components/ToDo'
import { PrismaClient } from '@prisma/client'

export const getServerSideProps = async () => {
  const prisma = new PrismaClient()

  const allStartDates = (await prisma.committee.findMany({
    select: {
      firstDay: true,
    },
  })).map(c => c.firstDay ?? "").filter(d => d)

  const MOTTAGNING_EVENTS_URL = "https://calendar.google.com/calendar/ical/71hb815m1g75pje527e7stt240%40group.calendar.google.com/public/basic.ics"

  const mottagningEvents = await ical.async.fromURL(MOTTAGNING_EVENTS_URL)

  return {
    props: { unparsedEvents: JSON.stringify(mottagningEvents), criticalDates: allStartDates }
  }
}

interface IndexProps {
  unparsedEvents: string,
  criticalDates: string[],
}

const Index: NextPage<IndexProps> = (props) => {
  return (
    <>
      <Head>
        <title>NollKIT - Mottagningskommittén inom Teknologsektionen Informationsteknik</title>
        <meta name="description" content="Varje år planerar och arrangerar vi mottagning för IT-sektionens 140 nya studenter på Chalmers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page>
        <div className="mt-28 flex flex-col gap-6 items-center lg:flex-row lg:mt-32 lg:gap-[20vw]">
          <Countdown criticalDates={props.criticalDates} />
          <ToDo unparsedEvents={props.unparsedEvents} />
        </div>
      </Page>
    </>
  )
}

export default Index
