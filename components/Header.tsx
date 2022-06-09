import Link from "next/link";
import React from "react";
import { useMediaQuery } from 'react-responsive';

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
      <div className={`fixed -z-10 top-0 w-screen h-28 pointer-events-none bg-gradient-to-b to-black/0 ${props.blackout ? "from-black/80" : "from-black/25"}`}></div>
      
      {
        useMediaQuery({ query: '(max-width: 900px)' }) ? <MobileHeader /> : <DesktopHeader />
      }
    </>
  )
}

function DesktopHeader() {

  interface HeaderItemProps {
    href: string,
    children: string
  }

  function HeaderItem(props: HeaderItemProps) {
    return (
      <Link href={props.href}>
        <a className="text-lg text-center px-5 whitespace-nowrap neo">
          {props.children}
        </a>
      </Link>
    )
  }

  function getGridColsString(): string {
    // Sets the correct column sizes depending on how many items there are
    return "0.8fr " + headerCategories.map( (category, index) => (index !== 0 ? "0.1fr " : "") + category.items.length + "fr ").join("")
  }

  return (
    <div className="mt-6 font-light grid grid-rows-2" style={{gridTemplateColumns: getGridColsString()}}>

      <div className="w-full flex flex-col items-end relative">
        <Link href="/">
          <a className="w-20 h-20 absolute -top-5">
            <img src="/bilder/märke/2022.png" alt="NollKIT'22" />
          </a>
        </Link>
      </div>

      { headerCategories.map((category, index) => (
        <React.Fragment key={category.name}>
          {
            index !== 0 ? <div className="border-l border-white mx-3"></div> : null
          }
          <div className="col-span-1 flex justify-center">
            {category.items.map(item => (
              <HeaderItem key={item.text} href={`/${item.href}`}>{item.text}</HeaderItem>
            ))}
          </div>
        </React.Fragment>
      ))}

      { headerCategories.map( category => (
        <React.Fragment key={category.name}>
          <div className="flex items-center">
            <div className="border-t border-t-white grow"></div>
          </div>
          <div className="flex items-center">
            <div className="border-t border-t-white grow"></div>
            <div className="px-3 text-xs font-light">{category.name}</div>
            <div className="border-t border-t-white grow"></div>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

function MobileHeader() {
  return (
    <>
      
    </>
  )
}

