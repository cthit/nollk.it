import Link from "next/link";

const ToDo = () => {
    return (
        <div className="font-po drop-sh">
            <div className="text-3xl">Att göra:</div>
            <div className="text-5xl lg:text-7xl whitespace-nowrap">
                <Link href="/nolldeklaration">
                    <a>Nolldeklarera -&gt;</a>
                </Link>
            </div>
        </div>
    )
}

export default ToDo;