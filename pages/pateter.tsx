import { NextPage } from "next"
import Head from "next/head"
import Precursor from "../components/Precursor"
import Header from "../components/Header"
import ReactPageScroller from 'react-page-scroller';
import { useState } from "react";
import PageInfo from "../components/PageInfo";  
import NavBall from "../components/NavBall";
import { Prisma, PrismaClient } from "@prisma/client";


export const getServerSideProps = async () => {
  const prisma = new PrismaClient()

  const allCommittees = await prisma.committee.findMany({
    include: {
      members: true
    }
  })

  return {
    props: { allCommittees: allCommittees }
  }
}

export type CommitteeWithMembers = Prisma.CommitteeGetPayload<{
  include: { members: true };
}>;

interface PateterProps {
  allCommittees: CommitteeWithMembers[]
}

const Pateter: NextPage<PateterProps> = ({allCommittees}) => {

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
  const scrollTo = (index: number) => {
    //It would be nice if this method executed a scroll
    setCurrentPage(index)
  }

  const toggleTopButton = (index: number) => {
    const topButton = document.getElementById("top-button")
    if (!topButton) return
    if (index === 0) {
      topButton.style.opacity = "0"
    } else {
      topButton.style.opacity = "0.7"
    }
  }

  const scrollDown = (index: number) => {
    //It would be nice if this method executed a scroll
    setCurrentPage(index)
  }

  

  const handlePageChange = (index: number) => {
    setCurrentPage(index)
    changeBgOpacity(index)
    toggleTopButton(index)
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

            {allCommittees.slice(1).map( committee => (
              <div key={committee.year}>
                <Precursor committee={committee} />
              </div>
            ))}
            
          </ReactPageScroller>
        </div>
      </div>
      
      <div className="fixed flex flex-col items-center right-4 self-center top-1/4">
          <NavBall index={0} scrollTo={() => scrollTo(0)} currentPage={currentPage} committeeyr={"Top"} ></NavBall>
          {allNollkit.map((committee: Committee, index) => (
            <NavBall index={index+1} scrollTo={() => scrollTo(index+1)} currentPage={currentPage} committeeyr={committee.year.toString().slice(-2)}></NavBall>
          ))}
        </div>
        <div id="top-button" onClick={() => scrollTo(0)} className="fixed right-10 bottom-10 p-2 opacity-0 bg-black bg-opacity-70 hover:opacity-100 hover:bg-opacity-100 transition-opacity duration-700">
          <span className="">Scroll to top</span>
        </div>

      <div className="fixed flex flex-col items-center w-screen top-0 z-50 pointer-events-none">
        <Header blackout={true} />
      </div>
    </>
  )
}

export default Pateter