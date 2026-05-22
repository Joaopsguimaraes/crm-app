import { ApiProperty } from "@nestjs/swagger";
import { CustomerPaginationResponse } from "./customer-pagination.response";
import { CustomerResponse } from "./customer.response";

export class CustomerListResponse {
  @ApiProperty({ type: [CustomerResponse] })
  data!: CustomerResponse[];

  @ApiProperty({ type: CustomerPaginationResponse })
  pagination!: CustomerPaginationResponse;
}
