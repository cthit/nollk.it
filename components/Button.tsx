interface ButtonProps {
  children: string
  color?: string
  disabled?: boolean
  action: () => void
}

const Button = (props: ButtonProps) => {
  return (
    <div onClick={props.action} className={`inline text-center whitespace-nowrap
      border border-white rounded-lg px-4 py-2 
      cursor-pointer select-none 
      
      ${ props.color ? props.color + " bg-opacity-30 hover:bg-opacity-40 active:bg-opacity-50" : "bg-white bg-opacity-0 hover:bg-opacity-10 active:bg-opacity-20" }
      transition-all
      ${ props.disabled ? "opacity-30 select-none cursor-not-allowed hover:bg-transparent active:bg-transparent" : "" }`}>
      {props.children}
    </div>
  )
}

export default Button