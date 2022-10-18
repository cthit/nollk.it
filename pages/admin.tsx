import { NextPage } from "next"
import Head from "next/head"
import { useRef, useState } from "react"
import Button from "../components/Button"
import Page from "../components/Page"

const Admin: NextPage = () => {
  return (
    <>
      <Head>
        <title>NollKIT - Mottagningskommittén inom Teknologsektionen Informationsteknik</title>
        <meta name="description" content="Varje år planerar och arrangerar vi mottagning för IT-sektionens 140 nya studenter på Chalmers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page blackout>
        Hej
      </Page>
    </>
  )
}

export default Admin