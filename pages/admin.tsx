import { PrismaClient } from "@prisma/client"
import { NextPage } from "next"
import Image from 'next/image'
import Head from "next/head"
import React, { useEffect, useState } from "react"
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

const Admin: NextPage<AdminProps> = (props: AdminProps) => {
  return (
    <>
      <Head>
        <title>NollKIT - Mottagningskommittén inom Teknologsektionen Informationsteknik</title>
        <meta name="description" content="Varje år planerar och arrangerar vi mottagning för IT-sektionens 140 nya studenter på Chalmers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page blackout>
        <div className="borde border-red-600 h-screen w-full flex flex-row gap-8 pt-28">
          <div className="flex-1 flex flex-col">
            <Accordion title="Kommittéer" fontSize={1.3}>
              {props.committees.map((committee) => committee.year.toString().slice(2, 3)) //get 10s digit
                .filter((digit, index, self) => self.indexOf(digit) === index) //get unique digits
                .map((digit) => (
                  <Accordion title={`NollKIT'${digit}X`} fontSize={1.1} key={digit}>
                    {props.committees.filter((committee) => committee.year.toString().slice(2, 3) === digit).map((committee) => (
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
            <Accordion title="Kalendrar" fontSize={1.3} />
          </div>
          <div className="flex-[4]">
            {props.committees.slice(1, 2).map((committee) => (
              <CommitteeManagementDisplay committee={committee} key={committee.year}/>
            ))}
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
}

const AccordionItem = (props: AccordionItemProps) => {
  return (
    <div className="opacity-80 hover:opacity-100 select-none cursor-pointer" onClick={() => { }}>
      {props.children}
    </div>
  )
}

interface CommitteeManagementDisplayProps {
  committee: CommitteeWithMembers
}

const CommitteeManagementDisplay = ({ committee }: CommitteeManagementDisplayProps) => {

  const [members, setMembers] = useState(committee.members)

  return (
    <div className="flex flex-col gap-4">

      <div className="text-3xl">{"NollKIT'" + committee.year.toString().slice(2)}</div>

      <div>
        <div className="text-2xl">Medlemmar</div>
        <div>
          {members.map((member, index) => (
            <Accordion title={member.name} fontSize={1} key={member.name}>
              <div className="flex flex-row gap-4 pt-2">
                <TextInput placeholder='Namn "Namn" Efternamn'>{member.name}</TextInput>
                <TextInput placeholder="Post">{member.role}</TextInput>
                <TextInput placeholder="Hälsningsfras">{member.greeting || ""}</TextInput>
              </div>
              <div className="flex flex-row justify-between pt-2 pb-2">
                <div className="flex-[2]">
                  <TextInput placeholder="Text">{member.text || ""}</TextInput>
                </div>
                <div className="flex-[1] flex flex-row justify-center">
                  <div className="w-36">
                    <ImageUpload title="Bild" imgurl={`/bilder/${committee.year}/poster/${member.role}.jpg`} />
                  </div>
                </div>
              </div>
              <div className="py-2">
                <Button action={() => {
                  setMembers(members.filter((_, i) => i !== index))
                }}>Ta bort</Button>
              </div>
            </Accordion>
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
        <div className="text-2xl">Bilder</div>
        <div className="flex flex-row gap-4 h-28">
          <ImageUpload title="Märke" imgurl={`/bilder/${committee.year}/märke.png`} />
          <ImageUpload title="Landskap" imgurl={`/bilder/${committee.year}/landskap.jpg`} />
          <ImageUpload title="Porträtt" imgurl={`/bilder/${committee.year}/porträtt.jpg`} />
          <ImageUpload title="Kommitté" imgurl={`/bilder/${committee.year}/kommitte.jpg`} />
        </div>
      </div>
      <div className="pt-8 mb-6">
        <Button action={() => { }}>
          Spara
        </Button>
      </div>
    </div>
  )
}

interface ImageUploadProps {
  title: string
  imgurl: string
}

const ImageUpload = ({ title, imgurl }: ImageUploadProps) => {

  const [isImage, setIsImage] = useState(false)

  useEffect(() => {
    (async () => {
      setIsImage(await hasImage(imgurl))
    })()
  }, [])

  return (
    <div className="aspect-square border border-white rounded-lg overflow-hidden relative flex flex-col justify-end bg-black/20 hover:bg-black/0 transition duration-200">
      <label className="w-full h-full appearance-none outline-none z-10 cursor-pointer">
        <input type="file" className="hidden"/>
      </label>
      { isImage ? (
        <Image src={imgurl} alt={title} layout="fill" className="-z-10 absolute object-cover h-full" />
      ) : (
        <div className="absolute top-1 left-2 text-xs italic">Bild saknas</div>
      )}
      <div className="absolute bg-gradient-to-t from-black to-black/0 h-1/3 w-full">
        <div className="absolute bottom-1 left-2">{title}</div>
      </div>
    </div>
  )
}

interface TextInputProps {
  placeholder: string
  children: string
}

const TextInput = ({ placeholder, children }: TextInputProps) => {
  return (
    <textarea rows={1} className={`resize-none border-b px-2 py-1 w-full h-full bg-transparent outline-none appearance-none overflow-x-hidden textInputScroll`} placeholder={placeholder} value={children} onChange={
      e => {
        children = e.target.value
      }
    } />
  )
}
