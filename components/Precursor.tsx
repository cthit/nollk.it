import Link from "next/link";
import React from "react";
import { CommitteeWithMembers } from "../pages/pateter";



const Precursor = ({ committee }: { committee: CommitteeWithMembers }) => {

    return (
        <div className="fixed w-screen h-screen">
            <div className="w-full h-full flex flex-col justify-center items-center pt-24 sm:pt-12">

                <div className="flex items-center justify-evenly flex-col h-full sm:flex-row w-10/12 sm:gap-8 sm:w-[95%]">

                    {/* Image */}
                    <div className="sm:max-w-[55%] sm:flex sm:items-center">
                        <img src={`/bilder/${committee.year}/kommitte.jpg`} alt={committee.year.toString()} className="max-h-[30vh] sm:max-h-[75vh]" />
                    </div>

                    {/* Text */}
                    <div>
                        <h1 className="text-5xl sm:text-6xl font-po mb-4 sm:mb-8">{"NollKIT'" + committee.year.toString().slice(2)}</h1>
                        <p className="italic text-lg sm:text-2xl mb-2">{committee.orderInImageDesc}:</p>

                        <div className="grid gap-x-10 gap-y-2 items-center text-sm" style={ {gridTemplateColumns: "auto auto"} }>
                            {committee.members.sort((a, b) => a.orderInImage - b.orderInImage).map( member => (
                                <React.Fragment key={member.name}>
                                    <span>{member.name}</span>
                                    <i>{member.role}</i>
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="mt-6">
                            <Link href={`/modul/${committee.year}.pdf`}>
                                <a className="text-lg sm:text-2xl italic font-bold hover:underline">Modul</a>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}



export default Precursor;
