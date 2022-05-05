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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page blackout={false} />

      <Countdown />
      <ToDo />
    </>
  )
}

export default Index
