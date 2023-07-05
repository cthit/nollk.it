import { useContext, useEffect, useState } from "react"
import YearContext from "../util/YearContext"

export default function Countdown({ criticalDates }: { criticalDates: string[] }) {

  interface TimeLeft {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const ctx = useContext(YearContext)

  const findCriticalDate = (criticalDates: string[], year: string): string => {
    return criticalDates.find(d => d.includes(year)) ?? ""
  }

  function getTimeLeft(year: string): TimeLeft {
    const todaysDate = new Date()

    const msDelta = new Date(findCriticalDate(criticalDates, year)).getTime() - todaysDate.getTime()

    const daysLeft = Math.floor(msDelta / (86_400_000))
    const hoursLeft = Math.floor((msDelta % 86_400_000) / 3_600_000)
    const minutesLeft = Math.floor((msDelta % 3_600_000) / 60_000)
    const secondsLeft = Math.floor((msDelta % 60_000) / 1000)

    return {
      days: daysLeft,
      hours: hoursLeft,
      minutes: minutesLeft,
      seconds: secondsLeft,
    }
  }

  /**
   * 
   * @param t Time left until critical date
   * @param d Days after critical date
   * @returns if date is passed
   */
  function criticalDatePassed(t: TimeLeft, d = 0): boolean {
    return (t.days <= -d && t.hours <= 0 && t.minutes <= 0 && t.seconds <= 0)
  }

  useEffect(() => {
    const downtick = setInterval(() => {
      setTimeLeft(getTimeLeft(ctx.year))
    }, 1000)

    return () => {
      clearInterval(downtick)
      setTimeLeft(getTimeLeft(ctx.year))
    }
  }, [ctx.year])

  return (
    <>
      {
        criticalDatePassed(timeLeft) ?
          criticalDatePassed(timeLeft, 90) ?
            <div className="flex flex-col items-center font-theme drop-sh pb-2">
              <p className="text-2xl">Mottagningen skedde för</p>
              <p className="text-7xl">{-timeLeft.days}</p>
              <p className="text-3xl">dagar sedan</p>
            </div>
            :
            <div className="flex flex-col items-center font-theme drop-sh pb-2">
              <p className="text-7xl">Mottagningen</p>
              <p className="text-3xl">har börjat!!</p>
            </div>
          :
          <div className="font-theme drop-sh grid grid-cols-2 grid-rows-3 items-end w-fit pb-2" style={{ gridTemplateColumns: "auto auto", gridTemplateRows: "auto auto auto" }}>
            <div className="text-8xl row-span-2 col-span-1 text-right pr-3 leading-[0.75]">{timeLeft.days}</div>
            <div className="text-2xl row-span-1 col-span-1 leading-[0.75]">{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</div>
            {/* Here 'ar' is added using ::after to "dag" to keep width consistent. Otherwise it will change the width when the timer ticks */}
            <div className={`text-5xl row-span-1 col-span-1 after:content-['ar'] ${timeLeft.days === 1 ? "after:invisible" : "after:visible"}`}>dag</div>
            <div className="text-3xl row-span-1 col-span-2 text-center">till mottagningen</div>
          </div>
      }
    </>
  )
} 