export class AppliedJobResponseDto {
  application: {
    id: string;
    status: string;
    appliedAt: Date;
  };

  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
  };
}
