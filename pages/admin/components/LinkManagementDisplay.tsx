import TextInput from "./TextInput"
import Button from "../../../components/Button"
import { useState } from "react"
import { Links } from "@prisma/client"

interface LinkManagementDisplayProps {
  links: Links[]
}
export default function LinkManagmenetDisplay(props: LinkManagementDisplayProps) {

  const [links, setLinks] = useState(props.links)

  return <>

    <div className="flex flex-col gap-8 pb-8">
      {
        links.sort( (a,b) => a.id > b.id ? 1 : -1 ).map( (link, index) => {
          return (
            <div key={link.id}>
              <h2 className="text-3xl pb-2">{link.id}</h2>
              <TextInput
                placeholder={link.id}
                setValue={inputvalue => {
                  setLinks([...links].with(index, {...link, url: inputvalue}))
                }}
              >
                {link.url}
              </TextInput>
            </div>
          )
        })
      }

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