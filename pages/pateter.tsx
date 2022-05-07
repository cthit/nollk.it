import { NextPage } from "next"
import Head from "next/head"
import Page from "../components/Page"

const Pateter: NextPage = () => {
    return (
        <>
            <Head>
                <title>Pateter</title>
            </Head>
            <Page blackout={false} />
        </>
    )
}

export default Pateter