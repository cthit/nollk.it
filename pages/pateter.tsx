import { NextPage } from "next"
import Head from "next/head"
import Page from "../components/Page"
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
        image: string,
        imageDesc: string,
        members: Member[]
    }

    const allNollkit: Committee[] = [
        {
            name: "NollKIT'21",
            image: "/bilder/nollkit21sky.jpg",
            imageDesc: "Från vänster",
            members: [
                { name: 'Eimer "Florett" Ahlstedt', role: 'Kassör' },
                { name: 'Clara "Champis" Simonsson', role: 'Ordförande' },
                { name: 'Sebastian "Kvalle" Kvaldén', role: 'Uppdragschef' },
                { name: 'Dadi "Klakinn" Andrason', role: 'Eventchef' },
                { name: 'Julia "Bieber" Böckert', role: 'Phadderchef' },
                { name: 'Sara "SÄPO" Borg', role: 'Infochef' },
                { name: 'Jacob "Drake" Bengtsson', role: 'PR-chef' },
                { name: 'Erik "Knuten" Henriksson', role: 'Vice ordförande' },
            ]
        },
        {
            name: "NollKIT'20",
            image: "/bilder/nollkit22.png",
            imageDesc: "Från vänster",
            members: [
                { name: 'Måns "Mums" Josefsson', role: 'Ordförande' },
                { name: 'Albert "Tabbe" Lund', role: 'Kassör' },
                { name: 'Jon "Snow" Emilsson', role: 'Eventchef' },
                { name: 'Josefin "josen" Nord', role: 'Phadderchef' },
                { name: 'Vilhelm "Drill" Hedquist', role: 'PR-chef' },
                { name: 'Ida "Ide" Dahl', role: 'Infochef' },
                { name: 'Felix "Heinz" Holmesten', role: 'Vice ordförande' },
            ],
        },
        {
            name: "NollKIT'20",
            image: "/bilder/skev1.jpg",
            imageDesc: "Från vänster",
            members: [
                { name: 'Måns "Mums" Josefsson', role: 'Ordförande' },
                { name: 'Albert "Tabbe" Lund', role: 'Kassör' },
                { name: 'Jon "Snow" Emilsson', role: 'Eventchef' },
                { name: 'Josefin "josen" Nord', role: 'Phadderchef' },
                { name: 'Vilhelm "Drill" Hedquist', role: 'PR-chef' },
                { name: 'Ida "Ide" Dahl', role: 'Infochef' },
                { name: 'Felix "Heinz" Holmesten', role: 'Vice ordförande' },
            ],
        },
        {
            name: "NollKIT'20",
            image: "/bilder/skev2.jpg",
            imageDesc: "Från vänster",
            members: [
                { name: 'Måns "Mums" Josefsson', role: 'Ordförande' },
                { name: 'Albert "Tabbe" Lund', role: 'Kassör' },
                { name: 'Jon "Snow" Emilsson', role: 'Eventchef' },
                { name: 'Josefin "josen" Nord', role: 'Phadderchef' },
                { name: 'Vilhelm "Drill" Hedquist', role: 'PR-chef' },
                { name: 'Ida "Ide" Dahl', role: 'Infochef' },
                { name: 'Felix "Heinz" Holmesten', role: 'Vice ordförande' },
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
                                <div className="section bg-cover h-full overflow-hidden" style={{backgroundImage: "url('/bilder/nollkit21sky.jpg')"}} >
                                    <div className="bg-black bg-opacity-40 h-full">
                                        <div className="patetdesc absolute left-[25%] top-[15%] drop-sh w-1/2 flex flex-col items-center">
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