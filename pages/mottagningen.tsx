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

        <div className="timeline-box mt-8 flex flex-col items-center">
          <div className="text-6xl font-theme text-center mb-12">Tidslinje</div>

          <div className="mb-12">
            <PageText>Nedan finns en timeline över allting man kan behöva göra innan mottagningen samt deadlines till dessa. Timelinen kan även innehålla lite roliga grejer som även sker efter mottagningen såsom aspning!</PageText>
          </div>

          <Timeline data={filteredTimelineData} />
        </div>

        <Divider />

        <div className="text-6xl font-theme text-center mt-8">
          Frequently Asked Questions
        </div>
        <div className="flex flex-col gap-4 lg:w-1/2 my-8">
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