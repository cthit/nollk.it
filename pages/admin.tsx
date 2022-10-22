import { PrismaClient } from "@prisma/client"
import { NextPage } from "next"
import Head from "next/head"
import { useState } from "react"
import Page from "../components/Page"
import { CommitteeWithMembers } from "../types"

export const getServerSideProps = async () => {  
  const prisma = new PrismaClient()
  const committees = await prisma.committee.findMany({
    include: {
      members: true
    }
  })
  
  return {
    props: { committees }
  }
}

interface AdminProps {
  committees: CommitteeWithMembers[]
}

const Admin: NextPage<AdminProps> = (props: AdminProps) => {
  return (
    <>
      <Head>
        <title>NollKIT - Mottagningskommittén inom Teknologsektionen Informationsteknik</title>
        <meta name="description" content="Varje år planerar och arrangerar vi mottagning för IT-sektionens 140 nya studenter på Chalmers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page blackout>
        <div className="border border-red-600 h-screen w-full flex flex-row pt-28">
          <div className="flex-1 flex flex-col">
            <Accordion title="Kommittéer" fontSize={1.3}>
              {props.committees.map((committee) => committee.year.toString().slice(2,3)) //get 10s digit
                .filter((digit, index, self) => self.indexOf(digit) === index) //get unique digits
                .map((digit) => (
                  <Accordion title={`NollKIT'${digit}X`} fontSize={1.1} key={digit}>
                    {props.committees.filter((committee) => committee.year.toString().slice(2,3) === digit).map((committee) => (
                      <AccordionItem key={committee.year}>
                        NollKIT'{committee.year.toString().slice(2)}
                      </AccordionItem>
                    ))}
                  </Accordion>
                ))
              }
            </Accordion>
            <Accordion title="Text" fontSize={1.3}>

            </Accordion>
            <div>Kalendrar</div>
          </div>
          <div className="flex-[4]"></div>
        </div>
      </Page>
    </>
  )
}

export default Admin

interface AccordionProps {
  title: string
  fontSize: number
  children: React.ReactNode
}

const Accordion = ({ title, fontSize, children }: AccordionProps) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="pt-1">
      <div className="flex flex-row justify-between items-center cursor-pointer transition-opacity opacity-80 hover:opacity-100" onClick={() => setOpen(!open)}>
        <div style={{fontSize: fontSize+"em"}}>{title}</div>
        <div className={`w-6 h-6 transition-all duration-300 grid place-items-center ${open ? "rotate-180" : "rotate-0"}`}>
          <img src="down.svg" alt="Down arrow"/>
        </div>
      </div>
      <div className={`pl-4 transition-all duration-300 overflow-hidden ${open ? "h-auto" : "h-0"}`}>
        {children}
      </div>
    </div>
  )
}

interface AccordionItemProps {
  children: React.ReactNode
}

const AccordionItem = (props: AccordionItemProps) => {
  return (
    <div className="opacity-80 hover:opacity-100 select-none cursor-pointer" onClick={}>
      {props.children}
    </div>
  )  
}
