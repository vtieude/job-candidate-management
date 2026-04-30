import { UserLevel } from "../common/enums"

export interface IFindAIJob extends IChatAIResponseFilter{
  location: string
  minSalary: number
  maxSalary: number
  company: string
  title: string
}

export interface IFindAICandidate extends IChatAIResponseFilter{
  level: UserLevel
}

export interface IChatAIResponseFilter {
  skills: string[]
  limit: number,
  page: number,
}