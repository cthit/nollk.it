import type { NextPage } from 'next'
import Head from 'next/head'
import ical from 'node-ical'
import Page from '../components/Page'
import Countdown from '../components/Countdown'
import ToDo from '../components/ToDo'
import { prisma } from '../prisma/prismaclient'

export const getServerSideProps = async () => {

  const allStartDates = (await prisma.committee.findMany({
    select: {
      firstDay: true,
    },
  })).map(committee => committee.firstDay ?? "").filter(day => day)

  const mottagningenEventsLink = await prisma.links.findFirst({
    where: {
      id: "_kalender0",
    },
  })

  const mottagningEvents = await ical.async.fromURL(mottagningenEventsLink?.url ?? "")

  return {
    props: { unparsedEvents: JSON.stringify(mottagningEvents ?? {}), criticalDates: allStartDates }
  }
}

interface IndexProps {
  unparsedEvents: string,
  criticalDates: string[],
}

const Index: NextPage<IndexProps> = (props) => {
  return (
    <>
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
