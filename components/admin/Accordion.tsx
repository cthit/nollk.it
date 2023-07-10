import { useState } from "react"

interface AccordionProps {
  title: string
  fontSize: number
  children?: React.ReactNode
}

export default function Accordion({ title, fontSize, children }: AccordionProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="pt-1">
      <div className={`flex flex-row justify-between items-center cursor-pointer select-none transition-opacity ${open ? "opacity-100" : "opacity-80"} hover:opacity-100`} onClick={() => setOpen(!open)}>
        <div style={{ fontSize: fontSize + "em" }}>{title}</div>
        {children && (
          <div className={`w-6 h-6 transition-all duration-300 grid place-items-center ${open ? "rotate-180" : "rotate-0"}`}>
            <img src="down.svg" alt="Down arrow" />
          </div>
        )}
      </div>
      {children && (
        <div className={`pl-4 transition-all duration-300 overflow-hidden ${open ? "h-auto" : "h-0"}`}>
          {children}
        </div>
      )}
    </div>
  )
}

interface AccordionItemProps {
  children: React.ReactNode
  onClick?: () => void
}

export function AccordionItem(props: AccordionItemProps){
  return (
    <div className="opacity-80 hover:opacity-100 select-none cursor-pointer" onClick={props.onClick}>
      {props.children}
    </div>
  )
}