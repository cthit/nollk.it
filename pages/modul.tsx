import type { NextPage } from 'next'
import Head from 'next/head'
import Page from '../components/Page'

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Modul</title>
        <meta name="description" content="Här kan du hitta alla gamla nollmoduler!" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Page blackout>
        <div className="absolute w-full flex flex-col items-center top-[20%] overflow-hidden">
          <div className="w-1/2 flex flex-col items-center">
            <div className="w-1/2 flex flex-col"> 
              <div className="font-po text-6xl mb-6 text-center">Nollmodulen</div>
              <div className="font-light text-justify">
                Innan du börjar på Chalmers finns det en hel del att lära sig. Därför har vi skapat Nollmodulen, en liten handbok med massor av nyttig information som kommer vara dig behjälplig, både innan, under och efter mottagningen.
              </div>
              <a className="text-xl mt-8 cursor-pointer underline text-center" href="/modul/2021.pdf">
                Läs årets modul här
              </a>
              <div>
                <div className="mt-24 font-po text-2xl">Gamla moduler</div>
                <a href="/modul/2020.pdf" className="block hover:underline">2020</a>
                <a href="/modul/2019.pdf" className="block hover:underline">2019</a>
                <a href="/modul/2018.pdf" className="block hover:underline">2018</a>
                <a href="/modul/2017.pdf" className="block hover:underline">2017</a>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </>
  )
}

export default Index