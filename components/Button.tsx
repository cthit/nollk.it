interface ButtonProps {
  children: string
  disabled?: boolean
  action: () => void
}

const Button = (props: ButtonProps) => {
  return (
    <div onClick={props.action} className={`inline border border-white rounded-lg px-4 py-2 cursor-pointer select-none hover:bg-white/10 active:bg-white/20 transition-all ${ props.disabled ? "opacity-30 select-none cursor-not-allowed hover:bg-transparent active:bg-transparent" : "" }`}>
      {props.children}
    </div>
  )
}

export default Button