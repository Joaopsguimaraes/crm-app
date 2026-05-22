import { ApiProperty } from "@nestjs/swagger";
import { CustomerAddressType } from "../enums/customer-address-type.enum";

export class CustomerAddressResponse {
  @ApiProperty({ example: "1df22398-5b85-4a7f-98c3-a8b680ae2fb9", format: "uuid" })
  id!: string;

  @ApiProperty({ example: "89de9206-7815-430a-b633-e2f70eaa1746", format: "uuid" })
  customerId!: string;

  @ApiProperty({ enum: CustomerAddressType, example: CustomerAddressType.Billing })
  type!: CustomerAddressType;

  @ApiProperty({ example: true })
  isDefault!: boolean;

  @ApiProperty({ example: "Av. Paulista, 1000", nullable: true, maxLength: 200 })
  line1!: string | null;

  @ApiProperty({ example: "12th floor", nullable: true, maxLength: 200 })
  line2!: string | null;

  @ApiProperty({ example: "Sao Paulo", nullable: true, maxLength: 120 })
  city!: string | null;

  @ApiProperty({ example: "SP", nullable: true, maxLength: 80 })
  state!: string | null;

  @ApiProperty({ example: "01310-100", nullable: true, maxLength: 30 })
  postalCode!: string | null;

  @ApiProperty({ example: "Brazil", nullable: true, maxLength: 80 })
  country!: string | null;

  @ApiProperty({ example: "2026-05-21T12:00:00.000Z", format: "date-time" })
  createdAt!: string;

  @ApiProperty({ example: "2026-05-21T12:30:00.000Z", format: "date-time" })
  updatedAt!: string;
}
