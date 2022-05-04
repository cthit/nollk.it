import HeaderItem from "./HeaderItem";
import styles from './Header.module.css'

export default function Header() {
  return (
    <div className={`${styles.headerGrid} mt-6 font-light`}>
      <div className="w-full flex flex-col items-end relative">
        <a className="w-20 h-20 absolute -top-5" href="./">
          <img src="/img/nollkit22.png" alt="NollKIT'22" />
        </a>
      </div>
      <div className={`${styles.nollkitItems} ${styles.headerItem}`}>
        <HeaderItem>Vi är NollKIT</HeaderItem>
        <HeaderItem>Pateter</HeaderItem>
      </div>
      <div className="border-l border-white mx-3"></div>
      <div className={`${styles.mottagningenItems} ${styles.headerItem}`}>
        <HeaderItem>Mottagingen</HeaderItem>
        <HeaderItem>Nolldeklaration</HeaderItem>
        <HeaderItem>Modul</HeaderItem>
        <HeaderItem>Schema</HeaderItem>
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