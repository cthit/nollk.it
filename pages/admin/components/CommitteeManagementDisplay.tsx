import { useState, useEffect } from "react"
import Button from "../../../components/Button"
import { CommitteeWithMembers } from "../../../types"
import ImageUpload from "./ImageUpload"
import TextInput from "./TextInput"
import { Accordion, AccordionItem } from "./Accordion"

interface CommitteeManagementDisplayProps {
  committee: CommitteeWithMembers
}

export default function CommitteeManagementDisplay({ committee }: CommitteeManagementDisplayProps) {

  const [members, setMembers] = useState(committee.members)
  let newMembers = [...members]

  const [year, setYear] = useState(committee.year)

  const [firstDay, setFirstDay] = useState(committee.firstDay)
  const [orderInImageDesc, setOrderInImageDesc] = useState(committee.orderInImageDesc)
  const [fontURL, setFontURL] = useState(committee.fontURL)

  useEffect(() => {
    setMembers(committee.members)
    setFirstDay(committee.firstDay)
    setOrderInImageDesc(committee.orderInImageDesc)
    setFontURL(committee.fontURL)
    setYear(committee.year)
  }, [committee])

  useEffect(() => {
    members.forEach((member, index) => {
      member.orderInImage = index + 1
    })
    newMembers = [...members]
  }, [members])

  return (
    <div className="flex flex-col gap-8 pb-12">

      <div className="text-3xl font-bold">{"NollKIT'" + year.toString().slice(2)}</div>

      <div>
        <div className="text-2xl">Medlemmar</div>
        <div>
          {members.map((member, index) => (
            <div className="flex flex-row gap-2 items-center py-1 w-full" key={member.name}>

              <div className="flex flex-col gap-2">
                {
                  index === 0 ? (
                    <></>
                  ) : (
                    <div className="w-6 cursor-pointer place-items-center transition opacity-80 hover:opacity-100" onClick={() => {
                      if (index > 0) {
                        const newMembers = [...members]
                        newMembers[index] = members[index - 1]
                        newMembers[index - 1] = members[index]
                        setMembers(newMembers)
                      }
                    }}>
                      <img src="down.svg" alt="Up arrow" className="rotate-180" />
                    </div>
                  )}
                {index === members.length - 1 ? (
                  <></>
                ) : (
                  <div className="w-6 cursor-pointer place-items-center transition opacity-80 hover:opacity-100" onClick={() => {
                    if (index < members.length - 1) {
                      const newMembers = [...members]
                      newMembers[index] = members[index + 1]
                      newMembers[index + 1] = members[index]
                      setMembers(newMembers)
                    }
                  }}>
                    <img src="down.svg" alt="Down arrow" />
                  </div>
                )}
              </div>

              <Accordion title={member.name} fontSize={1}>
                <div className="flex flex-row gap-4 pt-2">
                  <TextInput placeholder='Namn "Namn" Efternamn' setValue={(name) => { newMembers[index].name = name }}>{member.name}</TextInput>
                  <TextInput placeholder="Post" setValue={(role) => { newMembers[index].role = role }}>{member.role}</TextInput>
                  <TextInput placeholder="Hälsningsfras" setValue={(greeting) => { newMembers[index].greeting = greeting }}>{member.greeting || ""}</TextInput>
                </div>
                <div className="flex flex-row justify-between pt-2 pb-2">
                  <div className="flex-[2]">
                    <TextInput placeholder="Text" setValue={(text) => { newMembers[index].text = text }}>{member.text || ""}</TextInput>
                  </div>
                  <div className="flex-[1] flex flex-row justify-center">
                    <div className="w-36">
                      <ImageUpload title="Bild" type=".jpg,.jpeg" url={`${committee.year}/poster/${member.role}.jpg`} />
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <Button action={() => {
                    setMembers(members.filter((_, i) => i !== index))
                  }}>Ta bort</Button>
                </div>
              </Accordion>
            </div>
          ))}
        </div>
        <div className="pt-4">
          <Button action={() => {
            setMembers([...members, {
              year: committee.year,
              name: 'Namn "Nick" Efternamn',
              role: "Post",
              greeting: null,
              text: null,
              orderInImage: members.length + 1,
            }])
          }}>Lägg till medlem</Button>
        </div>
      </div>

      <div>
        <div className="text-2xl pb-2">Bilder</div>
        <div className="flex flex-row gap-4 h-28">
          <ImageUpload title="Märke" type=".png" url={`${year}/märke.png`} />
          <ImageUpload title="Logotyp" type=".png" url={`${year}/logotyp.png`} />
          <ImageUpload title="Dator" type=".jpg,.jpeg" url={`${year}/landskap.jpg`} />
          <ImageUpload title="Mobil" type=".jpg,.jpeg" url={`${year}/porträtt.jpg`} />
          <ImageUpload title="Patetbild" type=".jpg,.jpeg" url={`${year}/kommitte.jpg`} />
        </div>
      </div>

      <div className="w-1/3">
        <div className="text-2xl">Ordning i patetbilden</div>
        <TextInput placeholder={"Från vänster"} setValue={setOrderInImageDesc}>
          {orderInImageDesc}
        </TextInput>
      </div>

      <div className="w-1/3">
        <div className="text-2xl">Datum för första dagen</div>
        <TextInput placeholder={"YYYY-MM-DDTHH:MM:SS"} setValue={setFirstDay}>
          {firstDay}
        </TextInput>
      </div>

      <div className="w-2/3">
        <div className="text-2xl">Länk till font</div>
        <TextInput placeholder="URL till fonten" setValue={setFontURL}>
          {fontURL ?? ""}
        </TextInput>
      </div>

      <div>
        <Button color={"bg-green-500"} action={() => {
          const committeeWithMembers: CommitteeWithMembers = {
            year: committee.year,
            firstDay: firstDay,
            orderInImageDesc: orderInImageDesc,
            fontURL: fontURL ?? null,
            members: newMembers,
          }

          fetch("/api/admin/committee/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ year: committee.year }),
          }).then(() => {
            fetch("/api/admin/committee/add", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(committeeWithMembers),
            })
          }).then(() => alert("Sparat " + committee.year + " till databasen!"))
        }}>
          Spara till databasen
        </Button>
      </div>

    </div>
  )
}