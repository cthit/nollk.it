import { createContext } from "react"

const YearContext = createContext({ year: new Date().getFullYear.toString(), changeYear: (year: string) => {}} )

export default YearContext