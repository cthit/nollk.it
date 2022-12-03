import { NextPage } from "next"
import Head from "next/head"
import Precursor from "../components/Precursor"
import ReactPageScroller from 'react-page-scroller';
import { useEffect, useState } from "react";
import PageInfo from "../components/PageInfo";
import { Committee, Prisma, PrismaClient } from "@prisma/client";
import Page from "../components/Page";
import PageMargins from "../components/PageMargins";
import Button from "../components/Button";
import Divider from "../components/Divider";

const NavBall = (props: { index: number; committeeyear: string; currentPage: number; scrollTo: (to: number) => void }) => {
  return (
    <div onClick={() => { props.scrollTo(props.index) }} className="h-0 w-0 p-2.5 flex justify-end relative items-center m-px navBallBox cursor-pointer">
      <span className="transition-all opacity-0 navBallLabel">{props.committeeyear}</span>
      <span className={`navBall ${props.index === props.currentPage ? 'bg-slate-100' : ''} border visible p-1.5 border-slate-100 opacity-50 rounded-full m-2 transition-all duration-200`}></span>
    </div>
  )
};


export const getServerSideProps = async () => {
  const prisma = new PrismaClient()

  const allCommittees = await prisma.committee.findMany({
    include: {
      members: true
    }
  })

  allCommittees.shift()

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

const Pateter: NextPage<PateterProps> = ({ allCommittees }) => {

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
    setCurrentPage(index)
  }

  const [topButtonShown, setTopButtonShown] = useState<boolean>(false)

  const toggleTopButton = (index: number) => {
    index === 0 ? setTopButtonShown(false) : setTopButtonShown(true)
  }

  const [currentYear, setCurrentYear] = useState<number>(0)

  const handlePageChange = (index: number) => {
    setCurrentPage(index)
    changeBgOpacity(index)
    toggleTopButton(index)
    index === 0 ? setCurrentYear(new Date().getFullYear()) : setCurrentYear(allCommittees[index-1].year) // kind of ugly but there's no better way?
  };

  // set currentyear to current year with useEffect
  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <>
      <Head>
        <title>Pateter</title>
        <meta name="description" content="Pateter är de som har suttit NollKIT tidigare år" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page blackout unrestrictChildren currentYear={currentYear}>
        <ReactPageScroller
          animationTimer={700}
          animationTimerBuffer={0}
          renderAllPagesOnFirstRender={true}
          onBeforePageScroll={handlePageChange}
          customPageNumber={currentPage}
        >
          <PageMargins>
            <PageInfo heading="Pateter">
              På Chalmers är patet ett allmänt namn för personer som tidigare suttit i en förening/kommitté. De som har suttit i just NollKIT tidigare år kallas för NollQIT. De kan vara bra att ha lite då och då, både för NollKIT och för Nollan, eftersom de alltid svarar glatt på frågor om NollKIT råkar vara borta för stunden.
            </PageInfo>
            <Divider />

            <div className="absolute bottom-10 flex flex-col gap-4 items-center cursor-pointer py-2" onClick={() => scrollTo(1)}>
              <p className="text-sm italic">Skrolla för pateter</p>
              <img className="downarrow w-10 transition opacity-60" src={"/down.svg"} alt="arrow down" />
            </div>
          </PageMargins>

          {allCommittees.map(committee => (
            <div key={committee.year}>
              <Precursor committee={committee} />
            </div>
          ))}

        </ReactPageScroller>

        <div className="fixed flex flex-col items-center right-4 self-center top-1/4">
          <NavBall index={0} scrollTo={() => scrollTo(0)} currentPage={currentPage} committeeyear={"Top"} ></NavBall>
          {allCommittees.map((committee: Committee, index) => (
            <NavBall key={index} index={index + 1} scrollTo={() => scrollTo(index + 1)} currentPage={currentPage} committeeyear={committee.year.toString().slice(-2)}></NavBall>
          ))}
        </div>
        <div className={`fixed right-10 bottom-10 transition-opacity duration-300 ${topButtonShown ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Button action={() => scrollTo(0)}> 
            Scroll to top
          </Button>
        </div>
      </Page>
    </>
  )
}

export default Pateter