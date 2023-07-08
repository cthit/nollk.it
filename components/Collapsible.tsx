import { useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

interface CollapsibleProps {
    title: string;
    content: string;
}

const Collapsible = (props: CollapsibleProps) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="w-[60vw] min-w-[300px] m-10 transition-all rounded-md duration-700 flex bg-black/60" onClick={() => setIsActive(!isActive)}>
            <div className="w-full" >
                <div className="flex justify-between items-center rounded-md border p-2 border-neutral-400" >
                    <div className='text-2xl m-2'>{props.title}</div>
                    <div className='text-2xl m-2'>{isActive ? '-' : '+'}</div>
                </div>
                {<div className={`transition-all grid duration-500 px-3 ${isActive ? "grid-rows-[1fr] p-3" : "grid-rows-[0fr]"} `}>
                    <div className="overflow-hidden">
                        {<ReactMarkdown children={props.content}></ReactMarkdown>}
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default Collapsible