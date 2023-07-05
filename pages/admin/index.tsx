import { Category, Faq, Links, PageText, TimeLineEvent } from "@prisma/client"
import { prisma } from '../../prisma/prismaclient'
import { NextPage } from "next"
import React, { useEffect, useState } from "react"
import Button from "../../components/Button"
import Page from "../../components/Page"
import { CommitteeWithMembers } from "../../types"
import { Accordion, AccordionItem } from "./components/Accordion"
import CommitteeManagementDisplay from "./components/ManagementDisplays/CommitteeManagementDisplay"
import TextManagementDisplay from "./components/ManagementDisplays/TextManagementDisplay"
import LinkManagmenetDisplay from "./components/ManagementDisplays/LinkManagementDisplay"
import FaqManagmenetDisplay from "./components/ManagementDisplays/FaqManagementDisplay"
import { useRouter } from "next/router"
import TimelineManagementDisplay from "./components/ManagementDisplays/TimelineManagementDisplay"

export const getServerSideProps = async () => {
  const committees = await prisma.committee.findMany({
    include: {
      members: true
    }
  })

  const pageTexts = await prisma.pageText.findMany()

  const links = await prisma.links.findMany()

  const faqs = await prisma.faq.findMany()

  const timelineEvents = await prisma.timeLineEvent.findMany()
  const timelineCategories = await prisma.category.findMany()

  return {
    props: { committees, pageTexts, links, faqs, timelineEvents, timelineCategories }
  }
}

interface AdminProps {
  committees: CommitteeWithMembers[]
  pageTexts: PageText[]
  links: Links[]
  faqs: Faq[]
  timelineEvents: TimeLineEvent[]
  timelineCategories: Category[]
}

const MANAGEMENT_DISPLAYS = [
  {
    name: "Kommittéer",
    address: "kommitteer",
  },
  {
    name: "Text",
    address: "text",
  },
  {
    name: "Länkar",
    address: "länkar",
  },
  {
    name: "FAQ",
    address: "faq",
  },
  {
    name: "Tidslinje",
    address: "tidslinje",
  }
]

const Admin: NextPage<AdminProps> = (props: AdminProps) => {

  const [displayed, setDisplayed] = useState(MANAGEMENT_DISPLAYS[0].address)
  
  const router = useRouter()

  useEffect(() => {
    if (router.query["visa"]) {
      setDisplayed(router.query["visa"] as string)
    }
  }, [])

  const [committees, setCommittees] = useState<CommitteeWithMembers[]>(props.committees.sort((a, b) => b.year - a.year))
  const [selectedCommittee, setSelectedCommittee] = useState(committees[0])

  return (
    <>
      <Page blackout>
        <div className="w-full flex flex-row gap-8 pt-28">
          <div className="flex-1 flex flex-col">
            <Accordion title="Kommittéer" fontSize={1.3}>

              {committees.map((committee) => committee.year.toString().slice(2, 3)) //get 10s digit
                .filter((digit, index, self) => self.indexOf(digit) === index) //get unique digits
                .map((digit) => (
                  <Accordion title={`NollKIT'${digit}X`} fontSize={1.1} key={digit}>
                    {committees.filter((committee) => committee.year.toString().slice(2, 3) === digit).map((committee) => (
                      <AccordionItem key={committee.year} onClick={() => { setSelectedCommittee(committee); setDisplayed(MANAGEMENT_DISPLAYS[0].address); router.push("/admin?visa=kommitte") }}>
                        NollKIT'{committee.year.toString().slice(2)}
                      </AccordionItem>
                    ))}
                  </Accordion>
                ))
              }

              <div className="flex flex-col gap-4 my-4">
                <Button action={() => {
                  const year = committees[0].year + 1
                  setCommittees([{
                    year: year,
                    firstDay: year + "-01-01T00:00:00",
                    orderInImageDesc: "Från vänster",
                    members: []
                  }, ...committees])
                }}>Ny kommitté</Button>

                {committees.length > 0 ?
                  <Button color={"bg-red-600"} action={async () => {
                    if (confirm("Vill du ta bort " + committees[0].year + "?")) {
                      fetch("/api/admin/committee/delete", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ year: committees[0].year }),
                      }).then(() => {
                        setSelectedCommittee(committees[1])
                        setCommittees(committees.slice(1))
                      })
                    }
                  }}>
                    Ta bort översta
                  </Button>
                  :
                  <></>
                }
              </div>
            </Accordion>

            {
              MANAGEMENT_DISPLAYS.toSpliced(0, 1).map((display) => (
                <div key={display.address} className="text-[1.3em] opacity-80 hover:opacity-100 cursor-pointer" onClick={() => {
                  setDisplayed(display.address)
                  router.push("/admin?visa=" + display.address)
                }}>
                  {display.name}
                </div>
              ))
            }



          </div>
          <div className="flex-[4]">
            {(() => {
              switch (displayed) {

                default:
                  return <CommitteeManagementDisplay committee={selectedCommittee} />

                case "text":
                  return <TextManagementDisplay pageTexts={props.pageTexts} />

                case "länkar":
                  return <LinkManagmenetDisplay links={props.links} />

                case "faq":
                  return <FaqManagmenetDisplay faqs={props.faqs} />

                case "tidslinje":
                  return <TimelineManagementDisplay timelineEvents={props.timelineEvents} committees={props.committees} categories={props.timelineCategories} />
              }
            })()}
          </div>
        </div>
      </Page>
    </>
  )
}

export default Admin