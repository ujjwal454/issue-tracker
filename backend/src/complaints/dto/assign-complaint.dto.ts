import { IsString, IsNotEmpty } from 'class-validator';

export class AssignComplaintDto {
  @IsString()
  @IsNotEmpty()
  resolverId: string;
}

