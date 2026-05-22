import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";
import { customerDtoTransformers } from "./customer-dto-transformers";

export class CreateCustomerDto {
  @ApiProperty({ example: "ACME Ltda", maxLength: 200 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ example: "financeiro@acme.com", maxLength: 320 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string;

  @ApiPropertyOptional({ example: "+55 11 99999-0000", maxLength: 50 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: "Prefers email contact.", maxLength: 2_000 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(2_000)
  notes?: string;
}
