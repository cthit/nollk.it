interface PageInfo {
  heading: string,
  children: React.ReactNode
  unrestrictChildren?: boolean
}

export default function PageInfo(props: PageInfo) {

  return (
    // <div className="w-full flex flex-col items-center mb-12 mt-24 lg:mt-40">
    //   <div className="font-po text-6xl mb-6">{props.heading}</div>
    //   <div className="lg:w-1/3 font-light text-justify">
    //     {props.children}
    //   </div>
    // </div>
    <>
      {(props.unrestrictChildren ?? false) ? (
        props.children
      ) : (
        <div className="w-full flex flex-col items-center mb-12 mt-24 lg:mt-40">
          <div className="font-po text-6xl mb-6">{props.heading}</div>
          <div className="lg:w-1/3 font-light text-justify">
            {props.children}
          </div>
        </div>
      )}
    </>
  )
}