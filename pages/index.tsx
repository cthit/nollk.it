import type { NextPage } from 'next'
import Head from 'next/head'
import Countdown from '../components/Countdown'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>NollKIT - Mottagningskommittén inom Teknologsektionen Informationsteknik</title>
        <meta name="description" content="Varje år arrangerar vi mottagning för IT-sektions 140 nya studenter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div className="w-screen h-screen overflow-hidden flex flex-col items-center">
          <div className="bg-[url('/img/nollkit21sky.jpg')] bg-cover w-[113%] h-full"></div>
        </div>
        <div className="absolute top-0 w-screen h-28 bg-gradient-to-b from-black/25 to-black/0"></div>
        <div className="flex flex-col items-center w-screen absolute top-0">
          <Header />
        </div>
        <Countdown />
      </div>
    </>
  )
}

export default Home
