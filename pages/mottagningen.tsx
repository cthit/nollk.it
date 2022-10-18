import { PrismaClient } from "@prisma/client"
import { NextPage } from "next"
import ReactMarkdown from "react-markdown"
import Page from "../components/Page"
import PageInfo from "../components/PageInfo"

export const getServerSideProps = async () => {
    const prisma = new PrismaClient()

    const mottagningenText = (await prisma.pageText.findMany())[0].mottagningenText


    return {
        props: { mottagningenText: mottagningenText }
    }
}

interface MottagningenProps {
    mottagningenText: string
}

const Timeline = () => {

    const test: string = "**dab boom bang** [dab](https://www.google.com)"

    return (
        <div className="flex flex-col justify-start h-full w-full max-w-2xl border border-red-500">
            <div className="flex items-center">
                <div className="border p-3 border-slate-100 rounded-full"></div>
                <span className="m-1">Juni ----|</span>
            </div>
                <ReactMarkdown children={test}></ReactMarkdown>
        </div>

    )
};

const Mottagningen: NextPage<MottagningenProps> = ({ mottagningenText }) => {



    return (
        <>
            <Page blackout>

                <PageInfo heading="Hej Nollan!">
                    {mottagningenText}
                </PageInfo>

                <Timeline />

            </Page>
        </>
    )
}


export default Mottagningen