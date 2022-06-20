import { NextPage } from "next"
import Head from "next/head"
import Precursor from "../components/Precursor"
import Header from "../components/Header"
import ReactPageScroller from 'react-page-scroller';
import { useState } from "react";
import PageInfo from "../components/PageInfo";

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
      imageDesc: "Uppifrån vänster",
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
    },
    {
      name: "NollKIT'17",
      year: "2017",
      imageDesc: "Från vänster",
      members: [
        { name: 'Jacob "Mintuw" Rohdin', role: 'Organisatör' },
        { name: 'Gabriel "GW" Wallin ', role: 'Ordförande' },
        { name: 'Linnea "Prim" Bark', role: 'Phadderchef' },
        { name: 'Eli "Rudolf" Knoph', role: 'PR-chef' },
        { name: 'Olof "Blixxten" Enström', role: 'Kassör' },
        { name: 'Omar "Ouei" Oueidat', role: 'Uppdragschef' },
      ],
    },
    {
      name: "NollKIT'16",
      year: "2016",
      imageDesc: "Från vänster",
      members: [
        { name: 'Johanna "Yoschü" Schüldt', role: 'Modulchef' },
        { name: 'Frej "Täcket" Karlsson', role: 'Kassör' },
        { name: 'Pedram "Admin" Shirmohammad', role: 'Organisatör' },
        { name: 'Albin "L’Oréal" Bååw', role: 'Ordförande' },
        { name: 'Emilia "Vesslan" Vestlund', role: 'Uppdragschef' },
        { name: 'Amanda "Rabban" Jonsson', role: 'Phadderchef' },
        { name: 'Martin "Tino" Tran', role: 'PR-chef' },
      ],
    },
    {
      name: "NollKIT'15",
      year: "2015",
      imageDesc: "Från vänster",
      members: [
        { name: 'Katarina "Lovre" Bergbom', role: 'PR-chef' },
        { name: 'Mats "Maddy" Högberg', role: 'Organisatör' },
        { name: 'Ina "Chezz" Tran', role: 'Phadderchef' },
        { name: 'Tina "Tiny" Mostafavi', role: 'Ordförande' },
        { name: 'Johannes "Jolle" Hildén', role: 'Modulchef' },
        { name: 'Christian "Saser" Persson', role: 'Kassör' },
        { name: 'Viktoria "Bowg" Bogren', role: 'Uppdragschef' },
      ],
    },
    {
      name: "NollKIT'14",
      year: "2014",
      imageDesc: "Uppifrån vänster",
      members: [
        { name: 'Louise "Lollo" Lorentzon', role: 'Modulchef' },
        { name: 'Anna "Chikki" Nylander', role: 'Uppdragschef' },
        { name: 'Hampus "HåDD" Dahlin', role: 'Ordförande' },
        { name: 'Daniel "Eineving" Eineving', role: 'Kassör' },
        { name: 'Simon "siMsOn" Nielsen', role: 'PR-chef' },
        { name: 'Oskar "RutAn" Rutqvist', role: 'Phadderchef' },
        { name: 'Simon "Pendla" Petersson', role: 'Infochef' },
      ],
    },
    {
      name: "NollKIT'13",
      year: "2013",
      imageDesc: "Från vänster",
      members: [
        { name: 'William "golvmopp" Dahlberg', role: 'Infochef' },
        { name: 'Sara "Soya" Nadi', role: 'PR-chef' },
        { name: 'Danny "Lam(m)" Lam', role: 'Nolluppdragschef' },
        { name: 'Oskar "Rascal" Nyberg', role: 'Ordförande' },
        { name: 'Victor "Trivoc" Nilsson', role: 'Kassör' },
        { name: 'Julia "Jules" Friberg', role: 'Modulchef' },
        { name: 'Oskar "PJ" Dahlberg', role: 'Phadderchef' },
      ],
    },
    {
      name: "NollKIT'12",
      year: "2012",
      imageDesc: "Uppifrån vänster",
      members: [
        { name: 'Jonathan "Kara" Kara', role: 'Nolluppdragschef' },
        { name: 'Johan "Horv" Andersson', role: 'Phadderchef' },
        { name: 'Paula "PoW" Eriksson', role: 'Ordförande' },
        { name: 'Daniel "Roras" Augurell', role: 'Sponschef' },
        { name: 'Daniel "DBBE" Bergqvist', role: 'Kassör' },
        { name: 'Linus "Mushu" Karlsson', role: 'PR-chef' },
        { name: 'Magnus "Bosch" Huttu', role: 'Modulchef' },
      ],
    },
    {
      name: "NollKIT'11",
      year: "2011",
      imageDesc: "Uppifrån vänster",
      members: [
        { name: 'Samuel "samwise" Tiensuu', role: 'Phadderchef' },
        { name: 'Marika "Kohina" Hansson', role: 'Ordförande' },
        { name: 'Jack "weeeeeew" Pettersson', role: 'Nolluppdragschef' },
        { name: 'Cecilia "Vatten" Geijer', role: 'Kassör' },
        { name: 'Magnus "µ" Larsson', role: 'PR-chef' },
        { name: 'Josefina "Juice" Andreasson', role: 'Modulchef' },
        { name: 'Mathias "møhl" Forsén', role: 'Sponschef' },
      ],
    },
    {
      name: "NollKIT'10",
      year: "2010",
      imageDesc: "Uppifrån vänster",
      members: [
        { name: 'Ludvig "JC" Gjälby', role: 'Sponschef' },
        { name: 'Anders "Lall" Larsson', role: 'PR-chef' },
        { name: 'Julia "Jule" Adamsson', role: 'Phadderchef' },
        { name: 'Tomas "Tompa" Urdell', role: 'Kassör' },
        { name: 'Markus "_us" Pettersson', role: 'Nolluppdragschef' },
        { name: 'Oscar "Poscar" Söderlund', role: 'Modulchef' },
        { name: 'Daniel "Vind" Ström', role: 'Ordförande' },
      ],
    },
    {
      name: "NollKIT'09",
      year: "2009",
      imageDesc: "Uppifrån vänster",
      members: [
        { name: 'David "Zorek" Sundelius', role: 'Phadderchef' },
        { name: 'Gustav "Ægarn" Landén', role: 'Modulchef' },
        { name: 'Björn "Björne" Lexell', role: 'Kassör' },
        { name: 'David "Björk" Björkheim', role: 'PR-chef' },
        { name: 'Jessica "Solitude" Andersson', role: 'Sponschef' },
        { name: 'Fredrik "Freddie" Axelsson', role: 'Ordförande' },
        { name: 'Fiona "Fiona" Rolander', role: 'Nolluppdragschef' },
      ],
    },
    {
      name: "NollKIT'08",
      year: "2008",
      imageDesc: "Uppifrån",
      members: [
        { name: 'Alexander "Widar den vidunderlige" Widar', role: 'Nolluppdragschef' },
        { name: 'Birger "Jalle" Rydback', role: 'Phadderchef' },
        { name: 'Erik "Thinner" Larkö', role: 'Ordförande' },
        { name: 'John "JohnL" Lundberg', role: 'PR-chef' },
        { name: 'Carl "Eng" Engstöm', role: 'Modulchef' },
        { name: 'Erik "Bark" Axelsson', role: 'Kassör' },
        { name: 'Lisa "Chihua" Ryrholm', role: 'Sponschef' },
      ],
    },
    {
      name: "NollKIT'07",
      year: "2007",
      imageDesc: "Uppifrån vänster",
      members: [
        { name: 'Marcus "MaKKan" Sundberg', role: 'Kassör' },
        { name: 'Hans "Hasse" Andersson', role: 'PR-chef' },
        { name: 'Erik "Igno" Jutemar', role: 'Phadderchef' },
        { name: 'Olof "Grul" Kamp', role: 'Modulchef' },
        { name: 'Josef "Findus" Eklann', role: 'Ordförande' },
        { name: 'Patric Westberg', role: 'PR-chef' },
        { name: 'Nathalie "Natta" Nilsson', role: 'Nolluppdragschef' },
      ],
    },
    {
      name: "NollKIT'06",
      year: "2006",
      imageDesc: "Uppifrån vänster",
      members: [
        { name: 'Johan "Boberg" Boberg', role: 'Kassör' },
        { name: 'Nicklas "Viddo" Gummesson', role: 'PR- och sponsorchef' },
        { name: 'Gustav "Gussoh" Sohtell', role: 'Modulchef' },
        { name: 'Sebastian "sebbz" Jansson', role: 'Ordförande' },
        { name: 'Frida Polheimer', role: 'Kassör' },
        { name: 'Josefine "Jossan" Nimstedt', role: 'Ölchef' },
        { name: 'Andreas "Dukken" Duchen', role: 'Phadderchef' },
      ],
    },
    {
      name: "NollKIT'05",
      year: "2005",
      imageDesc: "Från vänster",
      members: [
        { name: 'Joakim Bick', role: 'Phadderchef' },
        { name: 'Niklas Fröjdh', role: 'Kassör' },
        { name: 'Martin Ruzicka', role: 'PR-chef' },
        { name: 'Mathias Hellman', role: 'Ordförande' },
        { name: 'Carolin Gunnarsson', role: 'Nolluppdragschef' },
        { name: 'Markus Westerström', role: 'Modulchef' },
        { name: 'Olle Markljung ', role: 'Öhlchef' },
      ],
    },
    {
      name: "NollKIT'04",
      year: "2004",
      imageDesc: "Från vänster",
      members: [
        { name: 'Odin Renhammar', role: 'Phadderchef' },
        { name: 'Carl-David Granbäck', role: 'Modulchef' },
        { name: 'Olessia Larsson', role: 'PR-chef' },
        { name: 'Kristian Nagel', role: 'Öhlchef' },
        { name: 'Alfred Olsson', role: 'Nolluppdragschef' },
        { name: 'Johan Ung', role: 'Ordförande' },
        { name: 'Christoffer Noring', role: 'Kassör' },
      ],
    },
    {
      name: "NollKIT'03",
      year: "2003",
      imageDesc: "Uppifrån vänster",
      members: [
        { name: 'Therese Berge', role: 'Sponsor & PR-ansvarig' },
        { name: 'Stefan Janson', role: 'Öhl & Häfvansvarig' },
        { name: 'Karin Andersson', role: 'Ordförande' },
        { name: 'Per Rehnberg', role: 'Phadderansvarig' },
        { name: 'Fredrik Möllerstrand', role: 'Vide Ordförande' },
        { name: 'Andreas Eliasson', role: 'Kassör' },
        { name: 'Hedvig Kamp', role: 'Modulansvarig' },
      ],
    },
    {
      name: "NollKIT'02",
      year: "2002",
      imageDesc: "Lite oklart",
      members: [
        { name: 'Petra Bodström', role: 'Phadderchef' },
        { name: 'Fredrik Jones', role: 'pHadderchef' },
        { name: 'Erik Nylund', role: 'Öl- och matansvarig' },
        { name: 'Daniel Olofsson', role: 'Vice ordförande och sponsoransvarig' },
        { name: 'Anna Sjödin', role: 'Modulansvarig' },
        { name: 'Emma Svensson', role: 'Kassör' },
        { name: 'Mikael Svensson', role: 'Transport- och prylansvarig' },
        { name: 'Daniel Åvall', role: 'Webansvarig' },
        { name: 'Björn Östlund', role: 'Ordförande' },
      ],
    },

  ]


  const [currentPage, setCurrentPage] = useState<number>(0)

  const changeBgOpacity = (index: number) => {
    const fp = document.getElementById("first-page")
    if (!fp) return
    if (index === 0) {
      fp.style.background = "rgba(0,0,0,0.8)"
    } else {
      fp.style.background = "rgba(0,0,0,0.9)"
    }
  }

  const scrollDown = (index: number) => {
    //It would be nice if this method executed a scroll
    setCurrentPage(index)
  }

  const handlePageChange = (index: number) => {
    setCurrentPage(index)
    changeBgOpacity(index)
  };

  return (
    <>
      <Head>
        <title>Pateter</title>
        <meta name="description" content="Pateter är de som har suttit NollKIT tidigare år" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-cover bg-top h-full w-screen bg-portrait landscape:bg-landscape">

        <div id="first-page" className={`bg-black h-full transition duration-700 bg-opacity-80`}>
          <ReactPageScroller
            animationTimer={700}
            animationTimerBuffer={0}
            renderAllPagesOnFirstRender={true}
            onBeforePageScroll={handlePageChange}
            customPageNumber={currentPage}
          >

            <>
              <div className="absolute top-20 w-full flex flex-col items-center">
                <div className="flex flex-col items-center w-10/12 lg:w-3/4">
                  <PageInfo heading="Pateter">
                    På Chalmers är patet ett allmänt namn för personer som tidigare suttit i en förening/kommitté. De som har suttit i just NollKIT tidigare år kallas för NollQIT. De kan vara bra att ha lite då och då, både för NollKIT och för Nollan, eftersom de alltid svarar glatt på frågor om NollKIT råkar vara borta för stunden.
                  </PageInfo>
                </div>
              </div>
              <div className="h-screen flex justify-center items-end pb-12">
                <div className="flex flex-col gap-4 items-center cursor-pointer py-2" onClick={() => scrollDown(1)}>
                  <p className="text-sm italic">Skrolla för pateter</p>
                  <img className="downarrow w-10 transition opacity-60" src={"/down.svg"} alt="arrow down" />
                </div>
              </div>
            </>

            {allNollkit.map( committee => (
              <div key={committee.name}>
                <Precursor precursor={committee} />
              </div>
            ))}
            
          </ReactPageScroller>
        </div>
      </div>
      <div className="fixed flex flex-col items-center w-screen top-0 z-50 pointer-events-none">
        <Header blackout={true} />
      </div>
    </>
  )
}

export default Pateter