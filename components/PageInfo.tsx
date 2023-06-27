import PageText from "./PageText"

interface PageInfo {
  heading: string,
  children: React.ReactNode
  unrestrictChildren?: boolean
}

export default function PageInfo(props: PageInfo) {

  return (
    <>
      {(props.unrestrictChildren ?? false) ? (
        props.children
      ) : (
        <div className="w-full flex flex-col items-center pb-12 pt-32 lg:pt-48">
          <div className="font-theme text-5xl lg:text-6xl mb-6 text-center">{props.heading}</div>
          <PageText>
            {props.children}
          </PageText>
        </div>
      )}
    </>
  )
}