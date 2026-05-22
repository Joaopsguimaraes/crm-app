import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
import { CustomerStatus } from "../enums/customer-status.enum";
import { customerDtoTransformers } from "./customer-dto-transformers";

export class ListCustomersQueryDto {
  @ApiPropertyOptional({
    description: "Comma-separated customer statuses.",
    enum: CustomerStatus,
    isArray: true,
    example: `${CustomerStatus.Active},${CustomerStatus.Blocked}`
  })
  @customerDtoTransformers.statusArray
  @IsOptional()
  @IsArray()
  @IsEnum(CustomerStatus, { each: true })
  status?: CustomerStatus[];

  @ApiPropertyOptional({ example: false })
  @customerDtoTransformers.optionalBoolean
  @IsOptional()
  @IsBoolean()
  includeArchived?: boolean;

  @ApiPropertyOptional({ example: "ACME", maxLength: 200 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiPropertyOptional({ enum: ["name", "createdAt"], example: "name" })
  @IsOptional()
  @IsIn(["name", "createdAt"])
  sort?: "name" | "createdAt";
}
