import { Member, PrismaClient } from "@prisma/client"
import { NextPage } from "next"
import Image from 'next/image'
import Head from "next/head"
import React, { ReactFragment, useEffect, useState } from "react"
import Button from "../components/Button"
import Page from "../components/Page"
import { CommitteeWithMembers } from "../types"
import { hasImage } from "../util"

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



interface AccordionProps {
  title: string
  fontSize: number
  children?: React.ReactNode
}

const Accordion = ({ title, fontSize, children }: AccordionProps) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="pt-1">
      <div className={`flex flex-row justify-between items-center cursor-pointer select-none transition-opacity ${open ? "opacity-100" : "opacity-80"} hover:opacity-100`} onClick={() => setOpen(!open)}>
        <div style={{ fontSize: fontSize + "em" }}>{title}</div>
        {children && (
          <div className={`w-6 h-6 transition-all duration-300 grid place-items-center ${open ? "rotate-180" : "rotate-0"}`}>
            <img src="down.svg" alt="Down arrow" />
          </div>
        )}
      </div>
      {children && (
        <div className={`pl-4 transition-all duration-300 overflow-hidden ${open ? "h-auto" : "h-0"}`}>
          {children}
        </div>
      )}
    </div>
  )
}

interface AccordionItemProps {
  children: React.ReactNode
  onClick?: () => void
}

const AccordionItem = (props: AccordionItemProps) => {
  return (
    <div className="opacity-80 hover:opacity-100 select-none cursor-pointer" onClick={props.onClick}>
      {props.children}
    </div>
  )
}

interface CommitteeManagementDisplayProps {
  committee: CommitteeWithMembers
}

const CommitteeManagementDisplay = ({ committee }: CommitteeManagementDisplayProps) => {

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

const uploadImage = async (url: string, file: File) => {

  if (file.size > 4_000_000) return alert("Bilden är för stor, max 4MB")

  const formData = new FormData()
  formData.append('file', file)
  formData.append('url', url)

  const res = await fetch("/api/admin/uploadImage", {
    method: "POST",
    body: formData,
  })
}

interface ImageUploadProps {
  title: string
  url: string
  type: ".png" | ".jpg,.jpeg"
}

const ImageUpload = ({ title, url, type }: ImageUploadProps) => {

  const [fullURL, setFullURL] = useState("/bilder/" + url)

  const [isImage, setIsImage] = useState(false)

  useEffect(() => {
    (async () => {
      setIsImage(await hasImage(fullURL))
    })()
  }, [fullURL])

  useEffect(() => {
    setFullURL("/bilder/" + url)
  }, [url])

  const isFile = (maybeFile: File | undefined | null): maybeFile is File => {
    return maybeFile !== null && maybeFile !== undefined
  }

  return (
    <div className="aspect-square border border-white rounded-lg overflow-hidden relative flex flex-col justify-end bg-black/20 hover:bg-black/0 transition duration-200">
      <label className="w-full h-full appearance-none outline-none z-10 cursor-pointer">
        <input type="file" accept={type} className="hidden" onChange={async (e) => {
          const maybeFile = e.target.files?.item(0)

          if (isFile(maybeFile)) {
            await uploadImage(url, maybeFile)
            const rand = Math.random()
            setFullURL("/bilder/" + url + "?" + rand) //rand is needed for the image to update, otherwise the browser keeps the url cached
          } else {
            console.error("No file")
          }
        }} />
      </label>
      {isImage ? (
        <Image src={fullURL} alt={title} layout={"fill"} className="-z-10 absolute object-cover h-full" />
      ) : (
        <div className="absolute top-1 left-2 text-xs italic">Bild saknas</div>
      )}
      <div className="absolute bg-gradient-to-t from-black to-black/0 h-1/3 w-full">
        <div className="absolute bottom-1 left-2">{title}</div>
      </div>
    </div>
  )
}

const TextManagementDisplay = () => {
  return (
    <div>Hej!</div>
  )
}

interface TextInputProps {
  placeholder: string
  children: string
  setValue: (value: string) => void
}

const TextInput = ({ placeholder, children, setValue }: TextInputProps) => {

  const [text, setText] = useState(children)

  useEffect(() => {
    setText(children)
  }, [children])

  return (
    <textarea rows={1} className={`resize-none border-b px-2 py-1 w-full bg-transparent outline-none appearance-none overflow-x-hidden textInputScroll`} placeholder={placeholder} value={text} onChange={
      e => {
        setText(e.target.value)
        setValue(e.target.value)
      }
    } />
  )
}
