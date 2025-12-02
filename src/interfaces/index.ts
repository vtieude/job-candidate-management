import { RoleEnum } from '../configs/enum';

export interface IAuthPayload {
  email: string,
  id: string,
  role: RoleEnum
}

export * from './chatGpt';