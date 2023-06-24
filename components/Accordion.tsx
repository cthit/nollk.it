import { useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

interface AccordionInfo {
    title: string;
    content: string;
}


const Accordion = (props: AccordionInfo) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="w-[60vw] min-w-[300px] m-10 transition-all rounded-md duration-700 flex bg-[#000]/[.6]" onClick={() => setIsActive(!isActive)}>
            <div className="w-full accordion-item" >
                <div className="flex justify-between items-center rounded-md border p-2 border-neutral-400" >
                    <div className='text-2xl m-2'>{props.title}</div>
                    <div className='text-2xl m-2'>{isActive ? '-' : '+'}</div>
                </div>
                {<div className={`accordion-content max-h-[400px] transition-all duration-500 overflow-hidden ${isActive ? "h-auto m-3" : "max-h-0"}`}>
                    {<ReactMarkdown children={props.content}></ReactMarkdown>}
                </div>}
            </div>
        </div>
    )
}

export default Accordion