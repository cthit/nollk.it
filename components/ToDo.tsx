import Link from 'next/link'
import { useEffect, useState } from 'react'

const ToDo = ( { unparsedEvents }: {unparsedEvents: string} ) => {

    const [todo, setTodo] = useState<{ text: string, url: string }>({ text: "hej", url: "" })

    const mottagningEvents = parseEvents(unparsedEvents)

    const getUpcomingArr = () => {
        return mottagningEvents.find( event => event.start > new Date().getTime() )?.title ?? "Inget, mottagningen är slut"
    }

    const m = new Date().getMonth() + 1
    const d = new Date().getDate()

    useEffect(() => {
        //console.log(getUpcomingArr() + " getupcomingarr")
        if (m >= 1) setTodo({ text: "Vibba", url: "" })
        if (m >= 3) setTodo({ text: "Phaddra", url: "youtube.com/watch?v=dQw4w9WgXcQ" })
        if (m >= 5) setTodo({ text: "Phaddervideo", url: "" })
        if (m >= 7) setTodo({ text: "Nolldeklarera", url: "" })
        if (m >= 8 && d >= 14) setTodo({ text: getUpcomingArr(), url: "" })
        if (m >= 9 && d >= 14) setTodo({ text: "Återhämta", url: "" })
        if (m >= 10) setTodo({ text: "Aspa", url: "" })
        if (m >= 12) setTodo({ text: "Vibba", url: "" })
    }, [])

    return (
        <div className="font-po drop-sh">
            <div className="text-3xl">Att göra:</div>
            <div className="text-5xl lg:text-7xl whitespace-nowrap">
                {todo.url !== "" ?
                    <Link href={todo.url}>
                        <a>{todo.text} -&gt;</a>
                    </Link>
                    :
                    todo.text
                }
            </div>
        </div>
    )
}

export default ToDo

const parseEvents = (unparsedEvents: string) => {
    const events = JSON.parse(unparsedEvents)
    let parsedEvents: { start: number, title: string }[] = []
    for (const key in events) {
        const event = events[key]
        if (event.type !== "VEVENT") continue
        parsedEvents.push({
            start: new Date(event.start.toString().split(".")[0]).getTime(),
            title: event.summary,
        })
    }
    return parsedEvents.sort((a, b) => a.start - b.start)
}