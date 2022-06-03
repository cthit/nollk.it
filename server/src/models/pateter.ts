import { ObjectId } from "mongodb";

interface Member {
    name: string,
    role: string,
  }

export default interface Pateter {
    name: string,
    imageDesc: string,
    year: string,
    members: Member[],
    id?: ObjectId
}