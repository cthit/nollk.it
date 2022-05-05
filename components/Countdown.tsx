import { useEffect, useState } from "react"

export default function Countdown() {

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 13,
    seconds: 37
  })

  const mottagningenStartDate: Date = new Date("2022-08-16")
  
  function updateTimer() {
    const todaysDate = new Date()

    const msDelta: number = mottagningenStartDate.getTime() - todaysDate.getTime()
  
    const daysLeft: number = Math.floor(msDelta / (86_400_000))
    const hoursLeft: number = Math.floor((msDelta % 86_400_000) / 3_600_000)
    const minutesLeft: number = Math.floor((msDelta % 3_600_000) / 60_000)
    const secondsLeft: number = Math.floor((msDelta % 60_000) / 1000)

    setTimeLeft({
      days: daysLeft,
      hours: hoursLeft,
      minutes: minutesLeft,
      seconds: secondsLeft
    })
  }
  

  useEffect(() => {
    updateTimer()
    const downtick = setInterval(() => {
      updateTimer()
      if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        clearInterval(downtick)
      }
    }, 1000)
  }, [])

  return (
    <div className="font-po absolute left-[20%] top-1/4 drop-shadow-md">
      <div className="text-7xl drop-sh">{timeLeft.days} : {timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}</div>
      <div className="text-4xl drop-sh">till mottagningen</div>
    </div>
  )
} 