import { ApiProperty } from "@nestjs/swagger";

export class CustomerPaginationResponse {
  @ApiProperty({ example: 1, minimum: 1 })
  page!: number;

  @ApiProperty({ example: 20, minimum: 1, maximum: 100 })
  pageSize!: number;

  @ApiProperty({ example: 42, minimum: 0 })
  total!: number;

  @ApiProperty({ example: 3, minimum: 0 })
  totalPages!: number;

  @ApiProperty({ example: true })
  hasMore!: boolean;
}
