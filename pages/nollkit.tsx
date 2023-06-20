import type { NextPage } from 'next'
import Head from 'next/head'
import PageInfo from '../components/PageInfo'
import Page from '../components/Page'
import YearContext from '../util/YearContext'
import { Member, PageText, PrismaClient } from '@prisma/client'
import { useContext } from 'react'
import ImageWithFallback from '../components/ImageWithFallback'

export const getServerSideProps = async () => {
  const prisma = new PrismaClient()

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

        <div className="flex flex-col lg:w-3/5 items-center">
          <div className="w-full h-36 relative mb-8">
            <ImageWithFallback src={`/bilder/${ctx.year}/logotyp.png`} layout="fill" objectFit="contain" />
          </div>
          {
            allMembers.filter(m => m.year.toString() === ctx.year).sort( (a, b) => a.orderInImage - b.orderInImage).map((n, i) => {
              return (
                <div key={n.role} className="grid grid-cols-5 gap-5 mb-8">

                  {i % 2 === 0 ? <></> : <NollkitDesc {...n} />}
                  <div className="col-span-2 aspect-[4/5] relative">
                    <ImageWithFallback src={`/bilder/${ctx.year}/poster/${n.role}.jpg`} layout="fill" objectFit="cover"/>
                  </div>
                  {i % 2 === 0 ? <NollkitDesc {...n} /> : <></>}

                  {/* Renders text below if mobile */}
                  <div className="col-span-5 md:hidden">
                    <NollkitText {...n} />
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

function NollkitDesc(props: Member) {
  return (
    <div className="flex flex-col col-span-3">
      <div className="font-theme text-4xl">{props.name}</div>
      <div className="text-2xl font-medium italic mb-3">{props.role}</div>

      <div className="hidden md:block">
        <NollkitText {...props} />
      </div>
    </div>
  )
}

function NollkitText(props: Member) {
  return (
    <>
      <div className="font-light italic mb-1">{props.greeting}</div>
      <div className="font-light">{props.text}</div>
    </>
  )
}