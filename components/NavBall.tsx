import { Committee } from "@prisma/client";
import { argv0 } from "process";

const NavBall = (props: {index: number; committeeyr: string; currentPage: number; scrollTo: (to: number) => void }) => {
    return (
        <div key={props.index} className="h-0 w-0 p-2.5 flex justify-end relative items-center m-px opacitykid">
            <span className="transition-all opacity-0 numberop" key={props.index}>{props.committeeyr}</span>
            <span key={props.index} onClick={() => { props.scrollTo(props.index) }} className={`floorButton ${props.index === props.currentPage ? 'bg-slate-100' : ''} border visible p-1.5 border-slate-100 rounded-full m-2 transition-all`}></span>
        </div>
    )
};

export default NavBall;