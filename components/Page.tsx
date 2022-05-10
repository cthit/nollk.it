import Header from "./Header";

interface PageProps {
  blackout?: boolean
  children?: React.ReactNode
}

export default function Page(props: PageProps) {
  return(
    <>
      <div className="fixed w-screen h-screen overflow-hidden flex flex-col items-center bg-black">
        <div className={`bg-cover w-[113%] h-full ${props.blackout ? "opacity-60" : ""}`} style={{backgroundImage: "url('/img/nollkit21sky.jpg')"}}></div>
      </div>
      {props.children}
      <div className={`fixed top-0 w-screen h-28 bg-gradient-to-b to-black/0 ${props.blackout ? "from-black/80" : "from-black/25"}`}></div>
      <div className="fixed flex flex-col items-center w-screen top-0">
        <Header />
      </div>
    </>
  )

}