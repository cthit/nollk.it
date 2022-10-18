import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext } from 'react'
import Button from '../components/Button'
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
        <Button action={() => {location.href="/modul/" + ctx.year + ".pdf"}}>
          Här hittar du årets modul
        </Button>
      </Page>
    </>
  )
}

export default Modul