import { useEffect, useState } from "react"

export default function Countdown() {

  interface TimeLeft {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 13,
    seconds: 37,
  })

  const criticalDate = new Date("2022-08-16T08:00:00")

  function getTimeLeft(): TimeLeft {
    const todaysDate = new Date()

    const msDelta = criticalDate.getTime() - todaysDate.getTime()

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

  function criticalDatePassed(t: TimeLeft): boolean {
    return (t.days <= 0 && t.hours <= 0 && t.minutes <= 0 && t.seconds <= 0)
  }

  useEffect(() => {
    setTimeLeft(getTimeLeft())
    const downtick = setInterval(() => {
      if (criticalDatePassed(getTimeLeft())) clearInterval(downtick)
      setTimeLeft(getTimeLeft())
    }, 1000)
  }, [])

  return (
    <>
      {
        criticalDatePassed(timeLeft) ?
          <div className="flex flex-col items-center font-po drop-sh pb-2">
            <p className="text-7xl">Mottagningen</p>
            <p className="text-3xl">har börjat!!</p>
          </div>
          :
          <div className="font-po drop-sh grid grid-cols-2 grid-rows-3 items-end w-fit pb-2" style={{ gridTemplateColumns: "auto auto", gridTemplateRows: "auto auto auto" }}>
            <div className="text-8xl row-span-2 col-span-1 text-right pr-3 leading-[0.75]" onClick={() => console.log(timeLeft.days)}>{timeLeft.days}</div>
            <div className="text-2xl row-span-1 col-span-1 leading-[0.75]">{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</div>
            {/* Here 'ar' is added using ::after to "dag" to keep width consistent. Otherwise it will change the width when the timer ticks */}
            <div className={`text-5xl row-span-1 col-span-1 after:content-['ar'] ${timeLeft.days === 1 ? "after:invisible" : "after:visible"}`}>dag</div>
            <div className="text-3xl row-span-1 col-span-2 text-center">till mottagningen</div>
          </div>
      }
    </>
  )
} 