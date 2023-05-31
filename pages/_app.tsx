import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import YearContext from "../util/YearContext";
import { useEffect, useState } from "react";
import Head from "next/head";


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
      <Head>
        <title>NollKIT - Mottagningskommittén inom Teknologsektionen Informationsteknik</title>
        <meta name="description" content="Varje år planerar och arrangerar vi mottagningen för de nyantagna studenterna på programmet informationsteknik på Chalmers." />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato&family=Passion+One&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Component {...pageProps} />
    </YearContext.Provider>
  )
}

export default App
