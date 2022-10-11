interface ButtonProps {
  children: string
  action: () => void
}

const Button = (props: ButtonProps) => {
  return (
    <div onClick={props.action} className="border border-white rounded-lg px-3 py-1 cursor-pointer select-none hover:bg-white/10 active:bg-white/20 transition-all">
      {props.children}
    </div>
  )
}

export default Button