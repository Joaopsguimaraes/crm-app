import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { CustomerAddressType } from "../enums/customer-address-type.enum";
import { customerDtoTransformers } from "./customer-dto-transformers";

export class CreateCustomerAddressDto {
  @ApiPropertyOptional({ enum: CustomerAddressType, example: CustomerAddressType.Billing })
  @IsOptional()
  @IsEnum(CustomerAddressType)
  type?: CustomerAddressType;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ example: "Av. Paulista, 1000", maxLength: 200 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  line1?: string;

  @ApiPropertyOptional({ example: "12th floor", maxLength: 200 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  line2?: string;

  @ApiPropertyOptional({ example: "Sao Paulo", maxLength: 120 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @ApiPropertyOptional({ example: "SP", maxLength: 80 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  state?: string;

  @ApiPropertyOptional({ example: "01310-100", maxLength: 30 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  postalCode?: string;

  @ApiPropertyOptional({ example: "Brazil", maxLength: 80 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;
}
