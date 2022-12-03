import { PrismaClient } from "@prisma/client"
import { NextPage } from "next"
import ReactMarkdown from "react-markdown"
import Page from "../components/Page"
import PageInfo from "../components/PageInfo"
import PageText from "../components/PageText"

export const getServerSideProps = async () => {
    const prisma = new PrismaClient()

    const mottagningenText = (await prisma.pageText.findMany())[0].mottagningenText

    return {
        props: { mottagningenText: mottagningenText }
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
}

interface timeLineData {
    text: string,
    date: string,
    category: {
        title: string,
        color: string,
    },
    link?: {
        url: string,
        text: string,
    }
}


const timelineData: timeLineData[] = [
    {
      text: "# Hi there 👋 \n - 🔭 I'm currently working on [nollk.it](https://github.com/cthit/nollk.it)  \n   Currently a part of [digIT](https://github.com/cthit) \n ### Previous Committees \n - Eventchef - NollKIT'21",
      date: "2022-08-14",
      category: {
          title: 'Innan mottagningen',
          color: '#018f69'
      },
      link: {
          url:
              'kotharidigital.com',
          text: 'Read more'
      }
    },
    {
      text: 'This is the second timeline item',
      date: new Date().toISOString(),
      category: {
          title: 'Innan mottagningen',
          color: '#018f69'
      },
      link: {
          url:
              'https://medium.com/@popflorin1705/javascript-coding-challenge-1-6d9c712963d2',
          text: 'Read more'
      }
    }
  ]

const TimelineItem = ({data}: {data: timeLineData}) => (
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
                    {data.link.text}
                </a>
            )}
            <span className="circle" />
        </div>
    </div>
);

const Timeline = () => {
    if (timelineData.length > 0) {
        return (
            <div className="timeline-container">
                {timelineData.map((data, idx) => (
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


// const Timeline = () => {

//     const test: string = "## Hi there 👋 \n - 🔭 I'm currently working on [nollk.it](https://github.com/cthit/nollk.it)  \n   Currently a part of [digIT](https://github.com/cthit) \n ### Previous Committees \n - Eventchef - NollKIT'21"

//     return (
//         <div className="flex flex-col justify-start h-full w-full max-w-2xl border border-red-500">
//             <div className="flex items-center">
//                 <div className="border p-3 border-slate-100 rounded-full"></div>
//                 <span className="m-1">Juni &#8254;&#8254;&#8254;|</span>
//             </div>
//             <div className="w-full h-auto pl-[10%] markdownBox">
//                 <ReactMarkdown children={test}></ReactMarkdown>
//             </div>
//         </div>

//     )
// };

const Mottagningen: NextPage<MottagningenProps> = ({ mottagningenText }) => {



    return (
        <>
            <Page blackout>

                <PageInfo heading="Hej Nollan!">
                    {mottagningenText}
                </PageInfo>
                <div className="timeline-box mt-[20vh] flex flex-col items-center">
                    <div className="font-bold text-6xl font-po text-center mb-12">Timeline</div>
                    <div className="mb-12">
                        <PageText>Nedan finns en timeline över allting man kan behöva göra innan mottagningen samt deadlines till dessa. Timelinen kan även innehålla lite roliga grejer som även sker efter mottagningen såsom aspning!</PageText>
                    </div>
                    <Timeline />
                </div>

            </Page>
        </>
    )
}


export default Mottagningen