import { PageText as PageTextType, Faq, TimeLineEvent } from "@prisma/client"
import { NextPage } from "next"
import { useContext } from "react"
import ReactMarkdown from "react-markdown"
import Collapsible from "../components/Collapsible"
import Divider from "../components/Divider"
import Page from "../components/Page"
import PageInfo from "../components/PageInfo"
import PageText from "../components/PageText"
import YearContext from "../util/YearContext"
import { prisma } from '../prisma/prismaclient'
import { TimelineEventWithCategory } from "../types"

export const getServerSideProps = async () => {

  const mottagningenText = (await prisma.pageText.findFirst({
    where: {
      page: "mottagningen"
    }
  }))

  const timeline = (await prisma.timeLineEvent.findMany(
    {
      include: {
        category: true,
      }
    }
  ))
  const sortedTimeline = timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const faqItems = await prisma.faq.findMany()
  const sortedFaqs = faqItems.sort((a, b) => a.orderInList - b.orderInList)

  return {
    props: {
      mottagningenText: mottagningenText,
      timelineData: sortedTimeline,
      faqItems: sortedFaqs
    }
  }
}

const parseDateTime = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  const parsedDate = `${day} ${month} ${year}`
  return parsedDate
}

interface MottagningenProps {
  mottagningenText: PageTextType
  timelineData: TimelineEventWithCategory[]
  faqItems: Faq[]
}

const TimelineItem = ({ data }: { data: TimelineEventWithCategory }) => (
  <div className="timeline-item">
    <div className="timeline-item-content">
      <span className="tag px-3 py-1 top-3 left-3" style={{ background: data.category.color }}>
        {data.category.title}
      </span>
      <time>{parseDateTime(data.date)}</time>
      <div className="my-4 text-left self-start">
        <ReactMarkdown children={data.text}></ReactMarkdown>
      </div>
      {data.link && (
        <a
          href={data.link}
          target="_blank"
        >
          { data.link.split('//').at(-1)?.split('/')[0].split('.').splice(-2).join('.') }
        </a>
      )}
      <span className="circle" />
    </div>
  </div>
);

const Timeline = ({ data }: { data: TimelineEventWithCategory[] }) => {
  if (data.length > 0) {
    return (
      <div className="timeline-container">
        {data.map((data, index) => (
          <TimelineItem data={data} key={index} />
        ))}
      </div>
    )
  } else {
    return <></>
  }
}


const Mottagningen: NextPage<MottagningenProps> = ({ mottagningenText, timelineData, faqItems }) => {

  const year = useContext(YearContext).year
  const filteredTimelineData = timelineData.filter((data) => data.year === year)

  return (
    <>
      <Page blackout>

        <PageInfo heading="Hej Nollan!">
          {mottagningenText.content}
        </PageInfo>

        <Divider />

        <div className="timeline-box mt-[20vh] flex flex-col items-center">
          <div className="font-bold text-6xl font-po text-center mb-12">Timeline</div>

          <div className="mb-12">
            <PageText>Nedan finns en timeline över allting man kan behöva göra innan mottagningen samt deadlines till dessa. Timelinen kan även innehålla lite roliga grejer som även sker efter mottagningen såsom aspning!</PageText>
          </div>

          <Timeline data={filteredTimelineData} />
        </div>

        <Divider />

        <div className="font-po font-bold w-[60vw] mt-8 ml-4">
          <span className="text-4xl">Frequently Asked Questions</span>
        </div>
        <div>
          {faqItems.map((faqItem, index) => (
            <div key={index}>
              <Collapsible title={faqItem.question} content={faqItem.answer} />
            </div>
          ))}
        </div>

      </Page>
    </>
  )
}

export default Mottagningen