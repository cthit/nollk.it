import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import YearContext from "../util/YearContext";
import { useEffect, useState } from "react";


function App({ Component, pageProps }: AppProps) {

  const [year, setYear] = useState<string>(new Date().getFullYear().toString())

  const changeYear = (newYear: string) => {
    setYear(newYear)
  }

  useEffect(() => {
    const LSYear = localStorage.getItem("year")
    if (LSYear !== null) {
      setYear(LSYear)
    }
  }, [])

  const [firstPass, setFirstPass] = useState(true)
  useEffect(() => {
    if (firstPass) return setFirstPass(false)

    localStorage.setItem("year", year)
  }, [year])

  return (
    <YearContext.Provider value={{ year, changeYear }}>
      <Component {...pageProps} />
    </YearContext.Provider>
  )
}

export default App
