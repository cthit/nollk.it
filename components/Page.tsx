import { useContext } from "react";
import YearContext from "../util/YearContext";
import Header from "./Header";
import PageMargins from "./PageMargins";
import ImageWithFallback from "./ImageWithFallback";

interface PageProps {
  blackout?: boolean
  children?: React.ReactNode
  unrestrictChildren?: boolean
  currentYear?: number
}

export default function Page(props: PageProps) {

  const ctx = useContext(YearContext)

  return (
    <>
      {/* Background */}
      <div className="fixed w-screen h-screen overflow-hidden bg-black -z-50">
        <div className={`w-full h-full ${props.blackout ? "opacity-20" : ""}`}>
          <div>
            <ImageWithFallback src={`/bilder/${ctx.year}/landskap.jpg`} fallbacksrc={`/bilder/reserv/landskap.jpg`} layout="fill" objectFit="cover" />
          </div>
          <div className="lg:hidden">
            <ImageWithFallback src={`/bilder/${ctx.year}/porträtt.jpg`} fallbacksrc={`/bilder/reserv/porträtt.jpg`} layout="fill" objectFit="cover" />
          </div>
        </div>
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
        <Header year={props.currentYear} blackout={props.blackout ?? false} />
      </div>
    </>
  )

}