import { CandidateStatusEnum } from "../../../common/enums";

export class CreateCandidateDto {
  email!: string;
  fullName!: string;
  skills!: string[];
  status!: CandidateStatusEnum;
}
