import TextInput from "../admin/TextInput"
import Button from "../Button"
import { useEffect, useState } from "react"
import { Faq } from "@prisma/client"

interface FaqManagementDisplay {
  faqs: Faq[]
}
export default function FaqManagementDisplay(props: FaqManagementDisplay) {

  const [faqs, setFaqs] = useState(props.faqs)

  // setFaqs(faqs.map((faq, index) => {
  //   return { ...faq, orderInList: index }
  // }))

  useEffect(() => {
    const sortedFaqs = faqs.sort((a, b) => a.orderInList > b.orderInList ? 1 : -1)
    const gaplessFaqs = sortedFaqs.map((faq, index) => {
      return { ...faq, orderInList: index }
    })
    setFaqs(gaplessFaqs)
  }, [])

  return <>

    <div className="flex flex-col gap-8 pb-8">
      {
        faqs.sort((a, b) => a.orderInList > b.orderInList ? 1 : -1).map((faq, index) => {
          return (
            <div className="bg-black/50 p-2 flex items-center">

              <div className="flex flex-col gap-2">
                {
                  index === 0 ? (
                    <></>
                  ) : (
                    <div className="w-6 cursor-pointer place-items-center transition opacity-80 hover:opacity-100" onClick={() => {
                      if (index > 0) {
                        const newFaqs = structuredClone(faqs)
                        newFaqs[index].orderInList = faqs[index - 1].orderInList
                        newFaqs[index - 1].orderInList = faqs[index].orderInList
                        setFaqs(newFaqs)
                      }
                    }}>
                      <img src="down.svg" alt="Up arrow" className="rotate-180" />
                    </div>
                  )}
                {index === faqs.length - 1 ? (
                  <></>
                ) : (
                  <div className="w-6 cursor-pointer place-items-center transition opacity-80 hover:opacity-100" onClick={() => {
                    if (index < faqs.length - 1) {
                      const newFaqs = structuredClone(faqs)
                      newFaqs[index].orderInList = faqs[index + 1].orderInList
                      newFaqs[index + 1].orderInList = faqs[index].orderInList
                      setFaqs(newFaqs)
                    }
                  }}>
                    <img src="down.svg" alt="Down arrow" />
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-grow">
                <TextInput placeholder="Fråga" setValue={
                  inputValue => {
                    const newFaqs = [...faqs]
                    newFaqs[index].question = inputValue
                    setFaqs(newFaqs)
                  }
                }>
                  {faq.question}
                </TextInput>
                <TextInput placeholder="Svar" setValue={
                  inputValue => {
                    const newFaqs = [...faqs]
                    newFaqs[index].answer = inputValue
                    setFaqs(newFaqs)
                  }
                }>
                  {faq.answer}
                </TextInput>
              </div>

            </div>
          )
        })
      }

      <div>
        <Button action={() => {
          setFaqs([...faqs, { id: "tempid" + (faqs.length + 1) , question: "", answer: "", orderInList: faqs.length }])
        }}>
          Lägg till fråga
        </Button>
      </div>

      <div>
        <Button color="bg-red-500" action={() => {
          const newFaqs = [...faqs]
          newFaqs.splice(-1, 1)
          setFaqs(newFaqs)
        }}>
          Ta bort nedersta frågan
        </Button>
      </div>

      <div>
        <Button color="bg-green-500" action={() => {
          fetch('/api/admin/faq/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(faqs)
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