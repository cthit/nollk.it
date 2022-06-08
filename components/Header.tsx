import styles from "../styles/Header.module.css"
import Link from "next/link";

type HeaderProps = {
  blackout: boolean
}

const headerItems = [
  {
    category: "NollKIT",
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
    category: "Mottagningen",
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
  }
]

export default function Header(props: HeaderProps) {
  return (
    <>
      {/* Background gradient */}
      <div className={`fixed -z-10 top-0 w-screen h-28 pointer-events-none bg-gradient-to-b to-black/0 ${props.blackout ? "from-black/80" : "from-black/25"}`}></div>

      {
        window.innerWidth > 768 ? <DesktopHeader /> : <MobileHeader />
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
        <a className="text-lg text-center px-5 neo">
          {props.children}
        </a>
      </Link>
    )
  }

  return (
    <div className={`${styles.headerGrid} mt-6 font-light`}>
      <div className="w-full flex flex-col items-end relative">
        <Link href="/">
          <a className="w-20 h-20 absolute -top-5">
            <img src="/bilder/märke/2022.png" alt="NollKIT'22" />
          </a>
        </Link>
      </div>
      <div className={`${styles.nollkitItems} ${styles.headerItem}`}>
        <HeaderItem href="/nollkit">Vi är NollKIT</HeaderItem>
        <HeaderItem href="/pateter">Pateter</HeaderItem>
      </div>
      <div className="border-l border-white mx-3"></div>
      <div className={`${styles.mottagningenItems} ${styles.headerItem}`}>
        <HeaderItem href="/mottagningen">Mottagingen</HeaderItem>
        <HeaderItem href="/nolldeklaration">Nolldeklaration</HeaderItem>
        <HeaderItem href="/modul">Modul</HeaderItem>
        <HeaderItem href="/schema">Schema</HeaderItem>
      </div>
      <div className={`${styles.underLine}`}>
        <div className={`${styles.hLine}`}></div>
      </div>
      <div className={`${styles.underLine}`}>
        <div className={`${styles.hLine}`}></div>
        <div className="px-3 text-xs font-light">NollKIT</div>
        <div className={`${styles.hLine}`}></div>
      </div>
      <div className={`${styles.underLine}`}>
        <div className={`${styles.hLine}`}></div>
      </div>
      <div className={`${styles.underLine}`}>
        <div className={`${styles.hLine}`}></div>
        <div className="px-3 text-xs font-light">Mottagningen</div>
        <div className={`${styles.hLine}`}></div>
      </div>
    </div>
  )
}

function MobileHeader() {
  return (
    <></>
  )
}

