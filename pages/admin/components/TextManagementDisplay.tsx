import TextInput from "./TextInput"

const texts = [
  "NollKIT",
  "Pateter",
  "Mottagning",
  "Modul",
]


export default function TextManagementDisplay() {

  
  
  return (
    <div>
      {
        texts.map((text, index) => {
          return (
            <div key={index}>
              <p>{text}</p>
              <TextInput placeholder={text} ></TextInput>
            </div>
          )
        })
      }


    </div>
  )
}