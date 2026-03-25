import { ApiProperty } from "@nestjs/swagger";
import { JobStatusEnum } from "../../../common/enums";

export class JobsDto {
  @ApiProperty()
  _id: string; 

  @ApiProperty()
  title: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  location: string;

  @ApiProperty({ enum: JobStatusEnum })
  status: JobStatusEnum; // 

  @ApiProperty({ required: false })
  salaryMin?: number;

  @ApiProperty({ required: false })
  salaryMax?: number;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  createdAt: string; 

  @ApiProperty()
  updatedAt: string; 

  @ApiProperty({ required: false })
  isApplied?: boolean; 

  @ApiProperty({ required: false })
  createdBy?: string; 
}
