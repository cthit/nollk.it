import TextInput from "../TextInput"
import Button from "../../../../components/Button"
import { useState } from "react"
import { Faq } from "@prisma/client"

interface FaqManagementDisplay {
  faqs: Faq[]
}
export default function FaqManagementDisplay(props: FaqManagementDisplay) {

  const [faqs, setFaqs] = useState(props.faqs)

  return <>

    <div className="flex flex-col gap-8 pb-8">
      {
        faqs.sort((a, b) => a.orderInList > b.orderInList ? 1 : -1).map((faq, index) => {
          return (
            <div className="bg-black/50 p-2">
              <TextInput placeholder="Fråga" setValue={
                inputValue => {
                  setFaqs(faqs.with(index, { ...faq, question: inputValue }))
                }
              }>
                {faq.question}
              </TextInput>
              <TextInput placeholder="Svar" setValue={
                inputValue => {
                  setFaqs(faqs.with(index, { ...faq, answer: inputValue }))
                }
              }>
                {faq.answer}
              </TextInput>
            </div>
          )
        })
      }

      <div>
        <Button action={() => {
          setFaqs([...faqs, { id: "bheoiugs", question: "", answer: "", orderInList: faqs.length}])
        }}>
          Lägg till fråga
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