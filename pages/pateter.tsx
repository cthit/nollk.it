import { NextPage } from "next"
import Head from "next/head"
import Page from "../components/Page"
import ReactFullpage from '@fullpage/react-fullpage'
import Patet from "../components/Patet"

const Pateter: NextPage = () => {
    return <ReactFullpage
        licenseKey={'gplv3-license'}
        scrollingSpeed={700} /* Options here */
        render={() => {
            return (
                <>
                    <ReactFullpage.Wrapper>
                        <Head>
                            <title>Pateter</title>
                        </Head>
                        <div className="section">
                            <Page blackout={true}>
                                <div className="patetdesc absolute left-[25%] top-[15%] drop-sh w-1/2 flex flex-col items-center">
                                    <div className="text-5xl font-po mb-5">
                                        <h1>Pateter</h1>
                                    </div>
                                    <div className="font-light w-[75%] text-xl">
                                        På Chalmers är patet ett allmänt namn för personer som tidigare suttit i en förening/kommitté. De som har suttit i just NollKIT tidigare år kallas för NollQIT. De kan vara bra att ha lite då och då, både för NollKIT och för Nollan, eftersom de alltid svarar glatt på frågor om NollKIT råkar vara borta för stunden.
                                    </div>
                                </div>

                            </Page>
                        </div>
                        <div className="section">
                            <Patet></Patet>
                        </div>
                        <div className="section">
                            <Patet></Patet>
                        </div>
                    </ReactFullpage.Wrapper>
                </>
            )
        }} />
}

export default Pateter