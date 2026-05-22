import { ApiProperty } from "@nestjs/swagger";
import { CustomerStatus } from "../enums/customer-status.enum";
import { CustomerCompleteness } from "./customer-completeness.response";
import { CustomerDuplicateSignal } from "./customer-duplicate-signal.response";

export class CustomerResponse {
  @ApiProperty({ example: "1df22398-5b85-4a7f-98c3-a8b680ae2fb9", format: "uuid" })
  id!: string;

  @ApiProperty({ example: "ACME Ltda", maxLength: 200 })
  name!: string;

  @ApiProperty({ enum: CustomerStatus, example: CustomerStatus.Active })
  status!: CustomerStatus;

  @ApiProperty({ example: "financeiro@acme.com", nullable: true, maxLength: 320 })
  email!: string | null;

  @ApiProperty({ example: "+55 11 99999-0000", nullable: true, maxLength: 50 })
  phone!: string | null;

  @ApiProperty({ example: "Prefers email contact.", nullable: true, maxLength: 2_000 })
  notes!: string | null;

  @ApiProperty({ type: CustomerCompleteness })
  completeness!: CustomerCompleteness;

  @ApiProperty({ type: [CustomerDuplicateSignal] })
  duplicateSignals!: CustomerDuplicateSignal[];

  @ApiProperty({ example: "2026-05-21T12:00:00.000Z", format: "date-time" })
  createdAt!: string;

  @ApiProperty({ example: "2026-05-21T12:30:00.000Z", format: "date-time" })
  updatedAt!: string;

  @ApiProperty({ example: null, nullable: true, format: "date-time" })
  archivedAt!: string | null;
}
