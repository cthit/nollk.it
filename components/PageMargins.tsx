interface PageMarginsProps {
  children?: React.ReactNode
}

const PageMargins = (props: PageMarginsProps) => {
  return (
    <div className="absolute w-full h-screen flex flex-col items-center">
      <div className="flex flex-col items-center w-10/12 lg:w-3/4">
        {props.children}
      </div>
    </div>
  )
}

export default PageMargins