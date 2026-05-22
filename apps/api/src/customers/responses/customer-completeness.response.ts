import { ApiProperty } from "@nestjs/swagger";

export class CustomerCompleteness {
  @ApiProperty({ example: true })
  hasPrimaryChannel!: boolean;

  @ApiProperty({ example: false })
  hasAddress!: boolean;

  @ApiProperty({ example: ["address"] })
  pending!: string[];
}
