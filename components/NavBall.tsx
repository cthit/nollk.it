import { Committee } from "@prisma/client";
import { argv0 } from "process";

const NavBall = (props: {index: number; committee: Committee; currentPage: number; scrollTo: (to: number) => void }) => {
    return (
        <div key={props.index + 1} className="h-0 w-0 p-2.5 flex justify-end relative items-center m-px opacitykid">
            <span className="transition-all opacity-0 numberop" key={props.index + 1}>{props.committee.year.toString().slice(-2)}</span>
            <span key={props.index + 1} onClick={() => { props.scrollTo(props.index + 1) }} className={`floorButton ${props.index + 1 === props.currentPage ? 'bg-slate-100' : ''} border visible p-1.5 border-slate-100 rounded-full m-2 transition-all`}></span>
        </div>
    )
};

export default NavBall;