import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { CustomerStatus } from "../enums/customer-status.enum";

export class UpdateCustomerStatusDto {
  @ApiProperty({ enum: CustomerStatus, example: CustomerStatus.Blocked })
  @IsEnum(CustomerStatus)
  status!: CustomerStatus;
}
