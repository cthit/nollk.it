import type { NextPage } from 'next'
import Head from 'next/head'
import Page from '../components/Page'

import Countdown from '../components/Countdown'
import ToDo from '../components/ToDo'

const Index: NextPage = () => {
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
          <ToDo />
        </div>
      </Page>
    </>
  )
}

export default Index
