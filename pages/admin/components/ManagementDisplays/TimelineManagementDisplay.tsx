import { Committee, TimeLineEvent } from "@prisma/client"
import TextInput from "../TextInput"
import Button from "../../../../components/Button"
import { useState } from "react"

interface TimelineManagementDisplayProps {
  timeline: TimeLineEvent[]
  committes: Committee[] //needed to see all available years
}

export default function TextManagementDisplay(props: TimelineManagementDisplayProps) {

  const [selectedYear, setSelectedYear] = useState(props.committes.sort((a, b) => b.year - a.year)[0].year)
  
  const [shownEvents, setShownEvents] = useState(props.timeline.filter(event => event.year === selectedYear.toString()))

  return <>

    <select onChange={e => {
      setSelectedYear(parseInt(e.target.value))
      setShownEvents(props.timeline.filter(event => event.year === e.target.value))
    }}>
      {
        props.committes.map(committee => {
          return <option key={committee.year} value={committee.year}>{committee.year}</option>
        })
      }
    </select>

    <div className="flex flex-col gap-8 pb-8">
      {
        pageTexts.map( (pageText, index) => {
          return (
            <div key={pageText.page}>
              <h2 className="text-3xl pb-2">{pageText.page}</h2>
              <TextInput
                placeholder={pageText.page}
                setValue={inputValue => {
                  setPageTexts([...pageTexts].with(index, { ...pageText, content: inputValue }))
                }}
              >
                {pageText.content}
              </TextInput>
            </div>
          )
        })
      }

      <div>
        <Button color="bg-green-500" action={() => {
          fetch('/api/admin/texts/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(pageTexts)
          }).then( res => {
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

    </div >

  </>
}