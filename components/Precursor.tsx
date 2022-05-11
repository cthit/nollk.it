import Page from "./Page";

type Member = {
    name: string,
    role: string
}

type Committee = {
    name: string,
    image: string,
    imageDesc: string,
    members: Member[]
}

const Precursor = ({precursor}: {precursor: Committee} ) => {
    
    return (
        <div className="fixed w-screen h-screen overflow-hidden flex flex-col items-center bg-cover" style={{backgroundImage: "url('/bilder/nollkit21sky.jpg')"}}>
            <div className="w-full h-full flex flex-col bg-opacity-90 bg-black justify-center overflow-visible">
                <div className="drop-sh flex flex-row justify-evenly overflow-visible max-h-[70%] items-center">
                    <div className="imagebox max-w-[50%] h-full max-h-full flex flex-row items-center justify-center">
                        <img src={precursor.image} alt={precursor.name} className="overflow-visible max-h-75vh" />
                    </div>
                    <div className="committee-desc">
                        <h1 className="text-white text-6xl font-po mb-8">{precursor.name}</h1>
                        <p className="text-white italic text-2xl">{precursor.imageDesc}:</p>
                        {precursor.members.map((member, index) => (
                            <div key={index} className="my-2 text-xl">
                                <span className="grid grid-cols-2 gap-6">
                                    {member.name} 
                                    <span className="italic">
                                        {member.role}
                                    </span>
                                </span>
                            </div>
                        ))}
                        <a href="/modul/" className="modul"></a>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}



export default Precursor;