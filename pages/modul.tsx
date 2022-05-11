import type { NextPage } from 'next'
import Head from 'next/head'
import Page from '../components/Page'

const Modul: NextPage = () => {
  return (
    <>
      <Head>
        <title>Modul</title>
        <meta name="description" content="Här kan du hitta alla gamla nollmoduler!" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Page blackout>
        <div className="absolute w-full flex flex-col items-center top-60 overflow-hidden">
          <div className="w-1/2 flex flex-col items-center">
            <div className="w-1/2 flex flex-col"> 
              <div className="font-po text-6xl mb-6 text-center">Nollmodulen</div>
              <div className="font-light text-justify">
                Innan du börjar på Chalmers finns det en hel del att lära sig. Därför har vi skapat Nollmodulen, en liten handbok med massor av nyttig information som kommer vara dig behjälplig, både innan, under och efter mottagningen.
              </div>
              <a className="text-xl mt-8 cursor-pointer underline text-center" href="/modul/2021.pdf">
                Läs årets modul här
              </a>
            </div>
          </div>
        </div>
      </Page>
    </>
  )
}

export default Modul