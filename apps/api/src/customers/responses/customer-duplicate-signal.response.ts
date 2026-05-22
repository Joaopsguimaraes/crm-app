import { ApiProperty } from "@nestjs/swagger";

export class CustomerDuplicateSignal {
  @ApiProperty({ example: "1df22398-5b85-4a7f-98c3-a8b680ae2fb9", format: "uuid" })
  customerId!: string;

  @ApiProperty({ example: ["name"] })
  fields!: string[];
}
