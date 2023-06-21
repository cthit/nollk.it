import { useState, useEffect, useRef } from "react"

interface TextInputProps {
  placeholder: string
  children: string
  setValue: (value: string) => void
}

export default function TextInput({ placeholder, children, setValue }: TextInputProps) {

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function updateHeight() {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "1px"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  const [text, setText] = useState(children)

  useEffect(() => {
    setText(children)
    //Gives the browser time to render the text before updating the height
    requestAnimationFrame(updateHeight)
  }, [children])

  return <>
    <style jsx>
      {`
        .textInputScroll::-webkit-scrollbar-thumb {
          background-color: white;
          border-radius: 10px;
          cursor: pointer;
        }
        
        .textInputScroll::-webkit-scrollbar-button {
          width: 0px;
          height: 10px;
        }
        
        .textInputScroll::-webkit-scrollbar {
          width: 0.1em;
          cursor: pointer;
        }
      `}
    </style>
    <textarea
      ref={textareaRef}
      rows={1}
      className={`resize-none border-b px-2 py-1 w-full bg-transparent outline-none appearance-none overflow-x-hidden textInputScroll`}
      placeholder={placeholder}
      value={text}
      onChange={
        e => {
          setText(e.target.value)
          setValue(e.target.value)
          updateHeight()
        }
      }
    />
  </>
}