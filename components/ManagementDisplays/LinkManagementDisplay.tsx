import TextInput from "../admin/TextInput"
import Button from "../Button"
import { useState } from "react"
import { Links } from "@prisma/client"

interface LinkManagementDisplayProps {
  links: Links[]
}
export default function LinkManagementDisplay(props: LinkManagementDisplayProps) {

  const [links, setLinks] = useState(props.links)

  const [newLinkName, setNewLinkName] = useState("")

  return <>

    <div className="flex flex-col gap-8 pb-8">
      {
        links.sort((a, b) => a.id > b.id ? 1 : -1).map((link, index) => {
          return (
            <div key={link.id} className="flex gap-8 items-center bg-black/50 px-5 py-3">
              <div className="flex-grow">
                <h2 className="text-3xl pb-2">{link.id}</h2>
                <TextInput
                  placeholder={link.id}
                  setValue={inputvalue => {
                    const newLinks = [...links]
                    newLinks[index].url = inputvalue
                    setLinks(newLinks)
                  }}
                >
                  {link.url}
                </TextInput>
              </div>
              <div className="">
                <Button color="bg-red-600" action={() => {
                  const newLinks = [...links]
                  newLinks.splice(index, 1)
                  setLinks(newLinks)
                }}>
                  Ta bort
                </Button>
              </div>
            </div>
          )
        })
      }

      <div className="flex gap-8 w-1/3">
        <TextInput placeholder="Ny länk" setValue={
          inputValue => {
            setNewLinkName(inputValue)
          }
        }>
          {newLinkName}
        </TextInput>
        <Button action={() => {
          setLinks([...links, { id: newLinkName, url: "" }])
          setNewLinkName("")
        }}>
          Lägg till
        </Button>
      </div>

      <div>
        <Button color="bg-green-500" action={() => {
          fetch('/api/admin/links/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(links)
          }).then(res => {
            if (res.status === 200) {
              alert("Sparat!")
            } else {
              alert("Något gick fel")
            }
          })
        }}>
          Spara
        </Button>
      </div>

    </div>

  </>
}