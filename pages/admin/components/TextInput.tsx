import { useState, useEffect } from "react"

interface TextInputProps {
  placeholder: string
  children: string
  setValue: (value: string) => void
}

export default function TextInput({ placeholder, children, setValue }: TextInputProps) {

  const [text, setText] = useState(children)

  useEffect(() => {
    setText(children)
  }, [children])

  return (
    <textarea rows={1} className={`resize-none border-b px-2 py-1 w-full bg-transparent outline-none appearance-none overflow-x-hidden textInputScroll`} placeholder={placeholder} value={text} onChange={
      e => {
        setText(e.target.value)
        setValue(e.target.value)
      }
    } />
  )
}