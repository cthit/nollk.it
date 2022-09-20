import Header from "./Header";

interface PageProps {
  blackout?: boolean
  children?: React.ReactNode
}

export default function Page(props: PageProps) {
  return (
    <>
      {/* Background */}
      <div className="fixed w-screen h-screen overflow-hidden flex flex-col items-center bg-black -z-50">
        <div className={`bg-cover bg-center w-full h-full bg-portrait landscape:bg-landscape ${props.blackout ? "opacity-20" : ""}`}></div>
      </div>

      {/* Content */}
      <div className="absolute top-20 w-full flex flex-col items-center">
        <div className="flex flex-col items-center w-10/12 lg:w-3/4">
          {props.children}
        </div>
      </div>

      {/* Header */}
      <div className="fixed flex flex-col items-center w-screen top-0 z-50 pointer-events-none">
        <Header blackout={props.blackout ?? false} />
      </div>
    </>
  )

}