import Button from './Button'
import Modal from './Modal'

type CalendarSubscribeModalProps = {
    url: string
    onClose: () => void
    background?: string
}

const CalendarSubscribeModal = (props: CalendarSubscribeModalProps) => {
    return (
        <Modal onClose={props.onClose} background={props.background}>
            <h2 className="text-2xl mb-4 pr-8">Lägg till i kalender</h2>

            <div className="flex flex-col gap-2">
                <CalendarLink
                    href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(
                        props.url
                    )}`}
                >
                    Google Kalender
                </CalendarLink>
                <CalendarLink href={props.url}>Apple Kalender</CalendarLink>
                <CalendarLink
                    href={`https://outlook.office.com/calendar/0/addcalendar?url=${encodeURIComponent(
                        props.url
                    )}`}
                >
                    Outlook
                </CalendarLink>
            </div>

            <div className="mt-8">
                <p>Eller kopiera länken nedan:</p>
                <input
                    type="text"
                    id="calendarLink"
                    disabled
                    aria-disabled="true"
                    value={props.url}
                    className="w-full px-1 rounded-sm bg-white text-black mt-2 mb-4"
                />

                <div className="w-full flex">
                    <span className="ml-auto">
                        <Button
                            action={() => {
                                console.log('Copying calendar link')

                                const inputElement = document.getElementById(
                                    'calendarLink'
                                ) as HTMLInputElement

                                inputElement.select()
                                inputElement.setSelectionRange(0, 99999)

                                navigator.clipboard.writeText(props.url)

                                alert('Kopierat!')
                            }}
                        >
                            Kopiera
                        </Button>
                    </span>
                </div>
            </div>
        </Modal>
    )
}

export default CalendarSubscribeModal

interface CalendarLinkProps {
    href: string
    children?: string
}

const CalendarLink = (props: CalendarLinkProps) => {
    return (
        <a
            className="text-cyan-600 underline"
            href={props.href}
            target="_blank"
        >
            {props.children}
        </a>
    )
}
