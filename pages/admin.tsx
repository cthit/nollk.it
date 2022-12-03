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

  const [committees, setCommittees] = useState<CommitteeWithMembers[]>(props.committees)
  const [displayed, setDisplayed] = useState(ManagementDisplay.Committee)
  const [selectedCommittee, setSelectedCommittee] = useState(props.committees.sort((a, b) => b.year - a.year)[0])

  return (
    <>
      <Head>
        <title>NollKIT - Mottagningskommittén inom Teknologsektionen Informationsteknik</title>
        <meta name="description" content="Varje år planerar och arrangerar vi mottagning för IT-sektionens 140 nya studenter på Chalmers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
              <AccordionItem>
                <div className="my-3">
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
                </div>
              </AccordionItem>
            </Accordion>
            <Accordion title="Text" fontSize={1.3}>

            </Accordion>
            <Accordion title="Kalendrar" fontSize={1.3} />
          </div>
          <div className="flex-[4]">
            {(() => {
              switch (displayed) {
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

  const setMemberName = (name: string, index: number) => {
    newMembers[index].name = name
  }

  const setMemberRole = (member: Member, index: number) => {
    const newMembers = [...members]
    newMembers[index].role = member.role
    setMembers(newMembers)
  }

  const setMemberGreeting = (member: Member, index: number) => {
    const newMembers = [...members]
    newMembers[index].greeting = member.greeting
    setMembers(newMembers)
  }

  const setMemberText = (member: Member, index: number) => {
    const newMembers = [...members]
    newMembers[index].text = member.text
    setMembers(newMembers)
  }

  const [firstDay, setFirstDay] = useState(committee.firstDay)
  const [orderInImageDesc, setOrderInImageDesc] = useState(committee.orderInImageDesc)
  const [fontURL, setFontURL] = useState(committee.fontURL)




  useEffect(() => {
    setMembers(committee.members)
  }, [committee])

  useEffect(() => {
    members.forEach((member, index) => {
      member.orderInImage = index + 1
    })
    newMembers = [...members]
  }, [members])

  return (
    <div className="flex flex-col gap-4">

      <div className="text-3xl font-bold">{"NollKIT'" + committee.year.toString().slice(2)}</div>

      <div>
        <div className="text-2xl">Medlemmar</div>
        <div>
          {members.map((member, index) => (
            <div className="flex flex-row gap-2 items-center py-1">

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

              <Accordion title={member.name} fontSize={1} key={member.name}>
                <div className="flex flex-row gap-4 pt-2">
                  <TextInput placeholder='Namn "Namn" Efternamn' setValue={(name) => {newMembers[index].name = name}}>{member.name}</TextInput>
                  <TextInput placeholder="Post" setValue={(role) => {newMembers[index].role = role}}>{member.role}</TextInput>
                  <TextInput placeholder="Hälsningsfras" setValue={(greeting) => {newMembers[index].greeting = greeting}}>{member.greeting || ""}</TextInput>
                </div>
                <div className="flex flex-row justify-between pt-2 pb-2">
                  <div className="flex-[2]">
                    <TextInput placeholder="Text" setValue={(text) => {newMembers[index].text = text}}>{member.text || ""}</TextInput>
                  </div>
                  <div className="flex-[1] flex flex-row justify-center">
                    <div className="w-36">
                      <ImageUpload title="Bild" type=".jpg,.jpeg" url={`/bilder/${committee.year}/poster/${member.role}.jpg`} />
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
          <ImageUpload title="Märke" type=".png" url={`/bilder/${committee.year}/märke.png`} />
          <ImageUpload title="Dator" type=".jpg,.jpeg" url={`/bilder/${committee.year}/landskap.jpg`} />
          <ImageUpload title="Mobil" type=".jpg,.jpeg" url={`/bilder/${committee.year}/porträtt.jpg`} />
          <ImageUpload title="Patetbild" type=".jpg,.jpeg" url={`/bilder/${committee.year}/kommitte.jpg`} />
        </div>
      </div>

      <div className="w-1/3">
        <div className="text-2xl">Ordning i patetbilden</div>
        <TextInput placeholder={"Från vänster"} setValue={setOrderInImageDesc}>
          {committee.orderInImageDesc}
        </TextInput>
      </div>

      <div className="w-1/3">
        <div className="text-2xl">Första dagen</div>
        <TextInput placeholder={"YYYY-MM-DDTHH:MM:SS"} setValue={setFirstDay}>
          {committee.firstDay}
        </TextInput>
      </div>

      <div className="w-2/3">
        <div className="text-2xl">Font</div>
        <TextInput placeholder="URL till fonten" setValue={setFontURL}>
          {committee.fontURL ?? ""}
        </TextInput>
      </div>

      <div className="pt-8 pb-4">
        <Button action={() => {
          const committeeWithMembers: CommitteeWithMembers = {
            year: committee.year,
            firstDay: firstDay,
            orderInImageDesc: orderInImageDesc,
            fontURL: fontURL ?? null,
            members: newMembers,
          }
          alert(JSON.stringify(committeeWithMembers))
        }}>
          Spara
        </Button>
      </div>
      <div className="pb-6">
        <Button action={() => { }}>
          Ta bort kommitté
        </Button>
      </div>
    </div>
  )
}

const uploadImage = async (url: string, file: File) => {

  // const buffer = await file.arrayBuffer()
  // const base64file = Buffer.from(buffer).toString('base64')
  //const base64file = "liten råtta äter daggmask" 
  //console.log(base64file)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('url', url)




  const res = await fetch("/api/admin/uploadImage", {
    method: "POST",
    body: formData,
    // body: JSON.stringify({
    //   url: url,
    //   file: base64file,
    // }),
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
  console.log(res)
  return res
}

interface ImageUploadProps {
  title: string
  url: string
  type: ".png" | ".jpg,.jpeg"
}

const ImageUpload = ({ title, url, type }: ImageUploadProps) => {

  const [isImage, setIsImage] = useState(false)

  useEffect(() => {
    (async () => {
      setIsImage(await hasImage(url))
    })()
  }, [url])

  const isFile = (maybeFile: File | undefined | null): maybeFile is File => {
    return maybeFile !== null && maybeFile !== undefined
  }

  return (
    <div className="aspect-square border border-white rounded-lg overflow-hidden relative flex flex-col justify-end bg-black/20 hover:bg-black/0 transition duration-200">
      <label className="w-full h-full appearance-none outline-none z-10 cursor-pointer">
        <input type="file" accept={type} className="hidden" onChange={async (e) => {
          const maybeFile = e.target.files?.item(0)

          console.log(maybeFile)

          if (isFile(maybeFile)) {
            const res = await uploadImage(url, maybeFile)
            console.log(res)
          } else {
            console.error("No file")
          }
        }} />
      </label>
      {isImage ? (
        <Image src={url} alt={title} layout="fill" className="-z-10 absolute object-cover h-full" />
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

  return (
    <textarea rows={1} className={`resize-none border-b px-2 py-1 w-full h-full bg-transparent outline-none appearance-none overflow-x-hidden textInputScroll`} placeholder={placeholder} value={text} onChange={
      e => {
        setText(e.target.value)
        setValue(e.target.value)
      }
    } />
  )
}
