import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext } from 'react'
import Page from '../components/Page'
import PageInfo from '../components/PageInfo'
import YearContext from '../util/YearContext'

const Modul: NextPage = () => {

  const ctx = useContext(YearContext)

  return (
    <>
      <Head>
        <title>Modul</title>
        <meta name="description" content="Modulen är din handbok för alla frågor kring mottagningen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page blackout>
        <PageInfo heading="Nollmodulen">
          Innan du börjar på Chalmers finns det en hel del att lära sig. Därför har vi skapat Nollmodulen, en liten handbok med massor av nyttig information som kommer vara dig behjälplig, både innan, under och efter mottagningen.
        </PageInfo>
        <a className="text-2xl mt-8 cursor-pointer underline text-center" href={`/modul/${ctx.year}.pdf`}>
          Läs årets modul här
        </a>
      </Page>
    </>
  )
}

export default Modul