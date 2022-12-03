import { PrismaClient } from "@prisma/client"
import { NextPage } from "next"
import { useContext } from "react"
import ReactMarkdown from "react-markdown"
import Divider from "../components/Divider"
import Page from "../components/Page"
import PageInfo from "../components/PageInfo"
import PageText from "../components/PageText"
import YearContext from "../util/YearContext"

export const getServerSideProps = async () => {
    const prisma = new PrismaClient()

    const mottagningenText = (await prisma.pageText.findMany())[0].mottagningenText

    const timeline = (await prisma.timeLineEvent.findMany(
        {
            include: {
                category: true,
                link: true
            }
        }
    ))
    console.log(timeline)
    // dont know how this works but it works, sorts ascending (timeline order)
    const sortedTimeline = timeline.sort(
        (objA, objB) => new Date(objA.date).getTime() - new Date(objB.date).getTime(),
    );

    return {
        props: {
            mottagningenText: mottagningenText,
            timelineData: sortedTimeline
        }
    }
}

const parseDateTime = (dateString: string) => {
    const date = new Date(dateString)
    console.log(date.toString())
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'long' })
    const year = date.getFullYear()
    const parsedDate = `${day} ${month} ${year}`
    return parsedDate
}

interface MottagningenProps {
    mottagningenText: string
    timelineData: timelineData[]
}

interface timelineData {
    text: string,
    year: string,
    date: string,
    category: {
        title: string,
        color: string,
    },
    link?: {
        url: string,
        name: string,
    }
}


const TimelineItem = ({ data }: { data: timelineData }) => (
    <div className="timeline-item">
        <div className="timeline-item-content">
            <span className="tag" style={{ background: data.category.color }}>
                {data.category.title}
            </span>
            <time>{parseDateTime(data.date)}</time>
            <div className="my-4 text-left self-start">
                <ReactMarkdown children={data.text}></ReactMarkdown>
            </div>
            {data.link && (
                <a
                    href={data.link.url}
                    target="_blank"
                >
                    {data.link.name}
                </a>
            )}
            <span className="circle" />
        </div>
    </div>
);

const Timeline = ({ data }: { data: timelineData[] }) => {
    if (data.length > 0) {
        return (
            <div className="timeline-container">
                {data.map((data, idx) => (
                    <TimelineItem data={data} key={idx} />
                ))}
            </div>
        )
    } else {
        return (
            <>
            </>
        );
    }
}


const Mottagningen: NextPage<MottagningenProps> = ({ mottagningenText, timelineData }) => {

    const year = useContext(YearContext).year
    console.log(timelineData)
    const filteredTimelineData = timelineData.filter((data) => data.year === year)

    return (
        <>
            <Page blackout>

                <PageInfo heading="Hej Nollan!">
                    {mottagningenText}
                </PageInfo>
                <Divider />
                <div className="timeline-box mt-[20vh] flex flex-col items-center">
                    <div className="font-bold text-6xl font-po text-center mb-12">Timeline</div>

                    <div className="mb-12">
                        <PageText>Nedan finns en timeline över allting man kan behöva göra innan mottagningen samt deadlines till dessa. Timelinen kan även innehålla lite roliga grejer som även sker efter mottagningen såsom aspning!</PageText>
                    </div>
                    <Timeline data={filteredTimelineData} />
                </div>

            </Page>
        </>
    )
}


export default Mottagningen