import Link from "next/link";
import React, { useState } from "react";

type HeaderProps = {
  blackout: boolean
}

const headerCategories = [
  {
    name: "NollKIT",
    items: [
      {
        text: "Vi är NollKIT",
        href: "nollkit",
      },
      {
        text: "Pateter",
        href: "pateter",
      },
    ]
  },
  {
    name: "Mottagningen",
    items: [
      {
        text: "Mottagningen",
        href: "mottagningen",
      },
      {
        text: "Nolldeklaration",
        href: "nolldeklaration",
      },
      {
        text: "Modul",
        href: "modul",
      },
      {
        text: "Schema",
        href: "schema",
      },
    ]
  },
]

export default function Header(props: HeaderProps) {

  return (
    <>
      {/* Background gradient */}
      <div className={`fixed top-0 w-screen -z-10 h-28 bg-gradient-to-b to-black/0 ${props.blackout ? "from-black/80" : "from-black/25"}`}></div>

      <div className="w-full lg:hidden pointer-events-auto">
        <MobileHeader />
      </div>
      <div className="hidden lg:block pointer-events-auto">
        <DesktopHeader />
      </div>
    </>
  )
}

function DesktopHeader() {

  function getGridColsString(): string {
    // Sets the correct column sizes depending on how many items there are in each category
    return "0.8fr " + headerCategories.map((category, index) => (index !== 0 ? "0.1fr " : "") + category.items.length + "fr ").join("")
  }

  return (
    <div className="mt-6 font-light grid grid-rows-2" style={{ gridTemplateColumns: getGridColsString() }}>

      <div className="w-full flex flex-col items-end relative">
        <Link href="/">
          <a className="w-20 h-20 absolute -top-5">
            <img src="/bilder/2022/märke.png" alt="NollKIT'22" />
          </a>
        </Link>
      </div>

      {headerCategories.map((category, index) => (
        <React.Fragment key={category.name}>
          {
            index !== 0 ? <div className="border-l border-white mx-3"></div> : null
          }
          <div className="col-span-1 flex justify-center">
            {category.items.map(item => (
              <Link href={`/${item.href}`} key={item.text}>
                <a className="text-lg text-center px-5 whitespace-nowrap neo">
                  {item.text}
                </a>
              </Link>
            ))}
          </div>
        </React.Fragment>
      ))}

      {headerCategories.map((category, index) => (
        <React.Fragment key={category.name}>
          <div className="flex items-center">
            <div className="border-t border-t-white grow"></div>
          </div>
          <div className="flex items-center">
            <div className="border-t border-t-white grow"></div>
            {
              index === 0 ? 
              <select className="px-3 text-xs font-light bg-transparent outline-none appearance-none cursor-pointer">
                <option selected disabled hidden>{category.name}</option>
                <option className="bg-black">2022</option>
                <option className="bg-black">2021</option>
                <option className="bg-black">2020</option>
                <option className="bg-black">2019</option>
              </select> 
              : 
              <p className="px-3 text-xs font-light">{category.name}</p>
            }
            <div className="border-t border-t-white grow"></div>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

function MobileHeader() {

  const [isOpen, setOpen] = useState(false)

  return (
    <>
      <div className={`fixed top-0 left-0 w-full h-full pt-28 bg-black/90 transition duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {
          headerCategories.map((category, index) => (
            <div key={category.name} className="ml-20">
              {
                index === 0 ? 
                <select className="text-xl italic mt-8 mb-3 bg-transparent outline-none appearance-none cursor-pointer">
                  <option selected disabled hidden>{category.name}</option>
                  <option className="bg-black">2022</option>
                  <option className="bg-black">2021</option>
                  <option className="bg-black">2020</option>
                  <option className="bg-black">2019</option>
                </select> 
                : 
                <p className="text-xl italic mt-8 mb-3">{category.name}</p>
              }
              {
                category.items.map(item => (
                  <Link href={`/${item.href}`} key={item.text}>
                    <a className="px-3 pb-1 text-lg font-light block neo w-fit">
                      {item.text}
                    </a>
                  </Link>
                ))
              }
            </div>
          ))
        }
      </div>

      <div className="w-full h-full px-5 relative">

        <div className="border-b border-b-white w-full pr-5 h-20 flex items-center justify-end">
          <div className="h-12">
            <Hamburger isOpen={isOpen} setOpen={setOpen} />
          </div>
        </div>

        <Link href="/">
          <a className="w-24 h-24 absolute top-2 left-12">
            <img src="/bilder/märke/2022.png" alt="NollKIT'22" />
          </a>
        </Link>

      </div>
    </>
  )
}

function Hamburger({ isOpen: isOpen, setOpen: setOpen }: { isOpen: boolean, setOpen: (isOpen: boolean) => void }) {
  const whiteline = "border-b-2 border-b-white w-full absolute transition-all"
  return (
    <div className="h-full aspect-square relative flex flex-col justify-center cursor-pointer select-none" onClick={() => setOpen(!isOpen)}>

      <div className={`relative transition-all duration-200 ${isOpen ? "h-0.5" : "h-3/4 "}`}>
        <div className={`${whiteline} top-0     ${isOpen ? " rotate-45 duration-300" : "rotate-0 duration-50"}`}></div>
        <div className={`${whiteline} bottom-0  ${isOpen ? "-rotate-45 duration-300" : "rotate-0 duration-50"}`}></div>
      </div>

      <div>
        <div className={`${whiteline} top-1/2 -translate-y-1/2 ${isOpen ? "opacity-0 duration-200" : "opacity-100 duration-300"}`}></div>
      </div>
      
    </div>
  )
}

