interface PageInfo {
  heading: string,
  children: React.ReactNode
}

export default function PageInfo(props: PageInfo) {

  return (
    <div className="w-full flex flex-col items-center mb-12">
      <div className="font-po text-6xl mb-6">{props.heading}</div>
      <div className="w-1/2 font-light text-justify">
        {props.children}
      </div>
    </div>
  )
}