import type { NextPage } from 'next'
import Head from 'next/head'
import PageInfo from '../components/PageInfo'
import Page from '../components/Page'
import YearContext from '../util/YearContext'
import { Member, PageText } from '@prisma/client'
import { useContext } from 'react'
import ImageWithFallback from '../components/ImageWithFallback'
import Divider from '../components/Divider'
import { prisma } from '../prisma/prismaclient'

export const getServerSideProps = async () => {

  const allMembers = await prisma.member.findMany()

  const text = await prisma.pageText.findFirst({
    where: {
      page: "nollkit"
    }
  })

  return {
    props: { allMembers: allMembers, text: text }
  }
}

interface NollkitProps {
  allMembers: Member[]
  text: PageText
}

const Nollkit: NextPage<NollkitProps> = ({ allMembers, text }) => {

  const ctx = useContext(YearContext)

  return (
    <>
      <Head>
        <title>Vi är NollKIT</title>
        <meta name="description" content="Vi är NollKIT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page blackout>
        <PageInfo heading="Vi är NollKIT">
          {text.content}  
        </PageInfo>
        <Divider />

        <div className="flex flex-col lg:w-3/5 items-center">
          
          <div className="w-full h-36 relative mb-8">
            <ImageWithFallback src={`/bilder/${ctx.year}/logotyp.png`} layout="fill" objectFit="contain" />
          </div>

          {
            allMembers.filter(member => member.year.toString() === ctx.year).sort( (a, b) => a.orderInImage - b.orderInImage).map((member, index) => {
              return (
                <div key={member.role} className="grid grid-cols-5 gap-5 mb-8">

                  {index % 2 === 0 ? <></> : <NollkitDesc member={member} textIsOnTheLeftSide={true} />}
                  <div className="col-span-2 aspect-[4/5] relative">
                    <ImageWithFallback src={`/bilder/${ctx.year}/poster/${member.role}.jpg`} layout="fill" objectFit="cover"/>
                  </div>
                  {index % 2 === 0 ? <NollkitDesc member={member} textIsOnTheLeftSide={false} /> : <></>}

                  {/* Renders text below instead if mobile */}
                  <div className="col-span-5 lg:hidden">
                    <NollkitText {...member} />
                  </div>
                </div>
              )
            })
          }
        </div>
      </Page>
    </>
  )
}

export default Nollkit

function NollkitDesc({member, textIsOnTheLeftSide}: {member: Member, textIsOnTheLeftSide: boolean}) {
  return (
    <div className={`flex flex-col col-span-3 ${textIsOnTheLeftSide ? "text-left" : "text-right lg:text-left"}`}>
      <div className="font-theme text-3xl pb-1">{member.name}</div>
      <div className="text-2xl font-medium italic mb-3">{member.role}</div>

      <div className="hidden lg:block">
        <NollkitText {...member} />
      </div>
    </div>
  )
}

function NollkitText(member: Member) {
  return (
    <>
      <div className="font-light italic mb-1">{member.greeting}</div>
      <div className="font-light text-justify">{member.text}</div>
    </>
  )
}