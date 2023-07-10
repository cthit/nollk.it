import { Category, Committee, TimeLineEvent } from "@prisma/client"
import TextInput from "../admin/TextInput"
import Button from "../Button"
import { useState } from "react"

interface TimelineManagementDisplayProps {
  timelineEvents: TimeLineEvent[]
  categories: Category[]
  committees: Committee[] //needed to see all available years
}

export default function TextManagementDisplay(props: TimelineManagementDisplayProps) {

  const [selectedYear, setSelectedYear] = useState(props.committees.sort((a, b) => b.year - a.year)[0].year)

  const [shownEvents, setShownEvents] = useState(props.timelineEvents.filter(event => event.year === selectedYear.toString()).sort((a, b) => a.date > b.date ? 1 : -1))

  const getCategoryColor = (categoryId: string) => {
    return props.categories.find(category => category.title === categoryId)?.color ?? props.categories[0].color
  }

  return <>

    <select className="bg-transparent text-lg mb-4 p-1" onChange={e => {
      setSelectedYear(parseInt(e.target.value))
      setShownEvents(props.timelineEvents.filter(event => event.year === e.target.value).sort((a, b) => a.date > b.date ? 1 : -1))
    }}>
      {
        props.committees.map(committee => {
          return <option className="bg-black" key={committee.year} value={committee.year}>{committee.year}</option>
        })
      }
    </select>

    <div className="flex flex-col gap-8 pb-8">
      {
        shownEvents.map((event, index) => {
          return (
            <div key={event.id} className="bg-black/50 p-5">

              <div className="flex items-start justify-between">
                <div className="p-1 px-2" style={{ backgroundColor: getCategoryColor(event.categoryId) }}>{event.categoryId}</div>
                <Button color="bg-red-500" action={() => {
                  const newShownEvents = [...shownEvents]
                  newShownEvents.splice(index, 1)
                  setShownEvents(newShownEvents)
                }}>
                  Ta bort
                </Button>
              </div>

              <TextInput placeholder="Datum ÅÅÅÅ-MM-DD" setValue={
                inputValue => {
                  const newShownEvents = [...shownEvents]
                  newShownEvents[index].date = inputValue
                  setShownEvents(newShownEvents)
                }
              }>
                {event.date}
              </TextInput>

              <TextInput
                placeholder="Text skriven i markdown"
                setValue={inputValue => {
                  const newShownEvents = [...shownEvents]
                  newShownEvents[index].text = inputValue
                  setShownEvents(newShownEvents)
                }}
              >
                {event.text}
              </TextInput>

              <TextInput
                placeholder="Eventuell länk"
                setValue={inputValue => {
                  const newShownEvents = [...shownEvents]
                  newShownEvents[index].link = inputValue
                  setShownEvents(newShownEvents)
                }}
              >
                {event.link as string}
              </TextInput>

            </div>
          )
        })
      }

      <div className="flex gap-4">
        <select id="category-select" className="p-1 rounded-md" style={{ backgroundColor: props.categories[0].color }} onChange={
          e => {
            e.target.style.backgroundColor = getCategoryColor(e.target.value)
          }
        }>
          {
            props.categories.map(category => {
              return <option style={{ backgroundColor: category.color }} key={category.title} value={category.title}>
                {category.title}
              </option>
            })
          }
        </select>

        <Button action={() => {
          setShownEvents([...shownEvents, {
            id: "tempid",
            categoryId: (document.getElementById("category-select") as HTMLSelectElement).value,
            date: "",
            text: "",
            link: "",
            year: selectedYear.toString()
          }])
        }
        }>
          Lägg till
        </Button>
      </div>

      <div>

        <Button color="bg-green-500" action={() => {
          fetch('/api/admin/timeline/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
              {
                events: shownEvents,
                year: selectedYear
              }
            )
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

    </div >

  </>
}