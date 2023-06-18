import { PrismaClient } from "@prisma/client"
import { NextPage } from "next"
import React, { useState } from "react"
import Button from "../../components/Button"
import Page from "../../components/Page"
import { CommitteeWithMembers } from "../../types"
import { Accordion, AccordionItem } from "./components/Accordion"
import CommitteeManagementDisplay from "./components/CommitteeManagementDisplay"

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

enum ManagementDisplay {
  Committee,
  Text,
  Calendar
}

const Admin: NextPage<AdminProps> = (props: AdminProps) => {

  const [displayed, setDisplayed] = useState(ManagementDisplay.Committee)

  const [committees, setCommittees] = useState<CommitteeWithMembers[]>(props.committees)
  const [selectedCommittee, setSelectedCommittee] = useState(props.committees.sort((a, b) => b.year - a.year)[0])

  return (
    <>
      <Page blackout>
        <div className="border border-red-600 h-screen w-full flex flex-row gap-8 pt-28">
          <div className="flex-1 flex flex-col">
            <Accordion title="Kommittéer" fontSize={1.3}>

              {committees.map((committee) => committee.year.toString().slice(2, 3)) //get 10s digit
                .filter((digit, index, self) => self.indexOf(digit) === index) //get unique digits
                .map((digit) => (
                  <Accordion title={`NollKIT'${digit}X`} fontSize={1.1} key={digit}>
                    {committees.filter((committee) => committee.year.toString().slice(2, 3) === digit).map((committee) => (
                      <AccordionItem key={committee.year} onClick={() => { setSelectedCommittee(committee) }}>
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
                    fontURL: null,
                    members: []
                  }, ...committees])
                }}>Ny kommitté</Button>

                { committees.length > 0 ?
                  <Button color={"bg-red-600"} action={async () => {
                    if (confirm("Vill du ta bort " + committees[0].year + "?")) {
                      fetch("/api/admin/committee/delete", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ year: committees[0].year }),
                      }).then(() => {
                        setCommittees(committees.slice(-1))
                        setSelectedCommittee(committees[1])
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
            <Accordion title="Text" fontSize={1.3}>

            </Accordion>
            <Accordion title="Kalendrar" fontSize={1.3} />
          </div>
          <div className="flex-[4]">
            {(() => {
              switch (displayed) { //Switch between displaying committee, text, or calendar
                default:
                  return <CommitteeManagementDisplay committee={selectedCommittee} />
              }
            })()}
          </div>
        </div>
      </Page>
    </>
  )
}

export default Admin




const TextManagementDisplay = () => {
  return (
    <div>Hej!</div>
  )
}
