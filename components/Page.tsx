import Header from "./Header";

interface PageProps {
  blackout?: boolean
  children?: React.ReactNode
}

export default function Page(props: PageProps) {
  return(
    <>
      <div className="fixed w-screen h-screen overflow-hidden flex flex-col items-center bg-black">
        <div className={`bg-cover bg-top w-full h-full ${props.blackout ? "opacity-60" : ""}`} style={{backgroundImage: "url('/bilder/bakgrund/2021.jpg')"}}></div>
      </div>
      {props.children}
      <div className="fixed flex flex-col items-center w-screen top-0 z-50">
        <Header blackout={props.blackout ?? false}/>
      </div>
    </>
  )

}