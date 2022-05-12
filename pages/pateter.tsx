import { NextPage } from "next"
import Head from "next/head"
import ReactFullpage from '@fullpage/react-fullpage'
import Precursor from "../components/Precursor"
import Header from "../components/Header"

const Pateter: NextPage = () => {

  interface Member {
    name: string,
    role: string,
  }

  type Committee = {
    name: string,
    imageDesc: string,
    year: string,
    members: Member[]
  }

  const allNollkit: Committee[] = [
    {
      name: "NollKIT'21",
      year: "2021",
      imageDesc: "Från uppe vänster",
      members: [
        { name: 'Sebastian "Kvalle" Kvaldén', role: 'Uppdragschef' },
        { name: 'Erik "Knuten" Henriksson', role: 'Vice ordförande' },
        { name: 'Daði "Klakinn" Andrason', role: 'Eventchef' },
        { name: 'Clara "Champis" Simonsson', role: 'Ordförande' },
        { name: 'Eimer "Florett" Ahlstedt', role: 'Kassör' },
        { name: 'Jacob "Drake" Bengtsson', role: 'PR-chef' },
        { name: 'Julia "Bieber" Böckert', role: 'Phadderchef' },
        { name: 'Sara "SÄPO" Borg', role: 'Infochef' },
      ]
    },
    {
      name: "NollKIT'20",
      year: "2020",
      imageDesc: "Från vänster",
      members: [
        { name: 'Ida "Ide" Dahl', role: 'Infochef' },
        { name: 'Vilhelm "Drill" Hedquist', role: 'PR-chef' },
        { name: 'Josefin "josen" Nord', role: 'Phadderchef' },
        { name: 'Felix "Heinz" Holmesten', role: 'Vice ordförande' },
        { name: 'Jon "Snow" Emilsson', role: 'Eventchef' },
        { name: 'Albert "Tabbe" Lund', role: 'Kassör' },
        { name: 'Måns "Mums" Josefsson', role: 'Ordförande' },
      ],
    },
    {
      name: "NollKIT'19",
      year: "2019",
      imageDesc: "Från vänster",
      members: [
        { name: 'Adam "Rondell" Rohdell', role: 'Phadderchef' },
        { name: 'Herman "Minus" Bergström', role: 'PR-chef' },
        { name: 'Amanda "Bassi" Déhlen', role: 'Ordförande' },
        { name: 'Hugo "Steget" Stegrell', role: 'Infochef' },
        { name: 'Pär "Giff" Aronsson', role: 'Eventchef' },
        { name: 'Jonathan "Carbol" Carbol', role: 'Kassör' },
        { name: 'Viktor "Norris" Fredholm', role: 'Uppdragschef' },
      ],
    },
    {
      name: "NollKIT'18",
      year: "2018",
      imageDesc: "Från vänster",
      members: [
        { name: 'Henrik "Hank" Lagergren', role: 'Kassör' },
        { name: 'Ellen "Plums" Widerstrand', role: 'Phadderchef' },
        { name: 'Mona "Moki" Kilsgård', role: 'Eventchef' },
        { name: 'Hassan "Flash" Jaber', role: 'Ordförande' },
        { name: 'Melker "Mike" Veltman', role: 'Infochef' },
        { name: 'Viktor "Vifraa" Franzén', role: 'Uppdragschef' },
        { name: 'Nils-Martin "Pon" Robeling', role: 'PR-chef' },
      ],
    }
  ]


  return (
    <>
      <ReactFullpage
        licenseKey={'gplv3-license'}
        scrollingSpeed={700} /* Options here */
        render={() => {
          return (
            <>
              <ReactFullpage.Wrapper>
                <Head>
                  <title>Pateter</title>
                </Head>
                <div className="section bg-cover h-full overflow-hidden" style={{ backgroundImage: "url('/bilder/bakgrund/2021.jpg')" }} >
                  <div className="bg-black bg-opacity-40 h-full">
                    <div className="absolute left-[25%] top-[15%] drop-sh w-1/2 flex flex-col items-center">
                      <div className="text-5xl font-po mb-5">
                        <h1>Pateter</h1>
                      </div>
                      <div className="font-light w-[75%] text-xl">
                        På Chalmers är patet ett allmänt namn för personer som tidigare suttit i en förening/kommitté. De som har suttit i just NollKIT tidigare år kallas för NollQIT. De kan vara bra att ha lite då och då, både för NollKIT och för Nollan, eftersom de alltid svarar glatt på frågor om NollKIT råkar vara borta för stunden.
                      </div>
                    </div>

                  </div>

                </div>
                {allNollkit.map((committee, index) => (
                  <div key={index} className="section">
                    <Precursor precursor={committee} />
                  </div>
                ))}
              </ReactFullpage.Wrapper>
            </>
          )
        }}
      />
      <div className="absolute top-0 flex flex-col items-center w-full">
        <Header />
      </div>
    </>
  )
}

export default Pateter