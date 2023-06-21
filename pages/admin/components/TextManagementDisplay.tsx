import { PageText } from "@prisma/client"
import TextInput from "./TextInput"
import Button from "../../../components/Button"
import { useState } from "react"

interface TextManagementDisplayProps {
  pageTexts: PageText[]
}
export default function TextManagementDisplay(props: TextManagementDisplayProps) {

  const [pageTexts, setPageTexts] = useState(props.pageTexts)

  return <>

    <div className="flex flex-col gap-8">
      {
        pageTexts.map(pageText => {
          return (
            <div key={pageText.page}>
              <p>{pageText.page}</p>
              <TextInput 
                placeholder={pageText.page}
                setValue={content => {
                  setPageTexts(pageTexts.map(text => {
                    if (text.page === pageText.page) {
                      return { ...text, content }
                    }
                    return text
                  }))     
                  console.log(pageTexts)         
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
        // NOW JUST SEND ENTIRE PAGE TEXTS TO SERVER
      }}>
        Spara
      </Button>
    </div>

  </div >

  </>
}