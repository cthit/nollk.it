import Link from "next/link";
import React from "react";

type Member = {
    name: string,
    role: string
}

type Committee = {
    name: string,
    imageDesc: string,
    year: string,
    members: Member[]
}

const Precursor = ({ precursor }: { precursor: Committee }) => {

    return (
        <div className="fixed w-screen h-screen">
            <div className="w-full h-full flex flex-col justify-center items-center pt-24 sm:pt-12">

                <div className="flex items-center justify-evenly flex-col h-full sm:flex-row w-10/12 sm:gap-8 sm:w-[95%]">

                    {/* Image */}
                    <div className="sm:max-w-[55%] sm:flex sm:items-center">
                        <img src={`/bilder/kommitte/${precursor.year}.jpg`} alt={precursor.name} className="max-h-[30vh] sm:max-h-[75vh]" />
                    </div>

                    {/* Text */}
                    <div>
                        <h1 className="text-5xl sm:text-6xl font-po mb-4 sm:mb-8">{precursor.name}</h1>
                        <p className="italic text-lg sm:text-2xl mb-2">{precursor.imageDesc}:</p>

                        <div className="grid gap-x-10 gap-y-2 items-center text-sm" style={ {gridTemplateColumns: "auto auto"} }>
                            {precursor.members.map((member, index) => (
                                <React.Fragment key={member.name}>
                                    <span>{member.name}</span>
                                    <i>{member.role}</i>
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="mt-6">
                            <Link href={`/modul/${precursor.year}.pdf`}>
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
