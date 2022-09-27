import Header from "./Header";
import PageMargins from "./PageMargins";

interface PageProps {
  blackout?: boolean
  children?: React.ReactNode
  unrestrictChildren?: boolean
}

export default function Page(props: PageProps) {
  return (
    <>
      {/* Background */}
      <div className="fixed w-screen h-screen overflow-hidden flex flex-col items-center bg-black -z-50">
        <div className={`bg-cover bg-center w-full h-full bg-portrait landscape:bg-landscape ${props.blackout ? "opacity-20" : ""}`}></div>
      </div>

      {/* Content */}
      {(props.unrestrictChildren ?? false) ? (
        props.children
      ) : (
        <PageMargins>
          {props.children}
        </PageMargins>
      )}


      {/* Header */}
      <div className="fixed flex flex-col items-center w-screen top-0 z-50 pointer-events-none">
        <Header blackout={props.blackout ?? false} />
      </div>
    </>
  )

}