import { ApiProperty } from "@nestjs/swagger";
import { CustomerContactRole } from "../enums/customer-contact-role.enum";

export class CustomerContactResponse {
  @ApiProperty({ example: "1df22398-5b85-4a7f-98c3-a8b680ae2fb9", format: "uuid" })
  id!: string;

  @ApiProperty({ example: "89de9206-7815-430a-b633-e2f70eaa1746", format: "uuid" })
  customerId!: string;

  @ApiProperty({ example: "Joao Silva", maxLength: 200 })
  name!: string;

  @ApiProperty({ enum: CustomerContactRole, example: CustomerContactRole.Financial })
  role!: CustomerContactRole;

  @ApiProperty({ example: "joao@acme.com", nullable: true, maxLength: 320 })
  email!: string | null;

  @ApiProperty({ example: "+55 11 98888-0000", nullable: true, maxLength: 50 })
  phone!: string | null;

  @ApiProperty({ example: "Finance decision maker.", nullable: true, maxLength: 1_000 })
  notes!: string | null;

  @ApiProperty({ example: "2026-05-21T12:00:00.000Z", format: "date-time" })
  createdAt!: string;

  @ApiProperty({ example: "2026-05-21T12:30:00.000Z", format: "date-time" })
  updatedAt!: string;
}
