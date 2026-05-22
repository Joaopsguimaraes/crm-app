import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { CustomerContactRole } from "../enums/customer-contact-role.enum";
import { customerDtoTransformers } from "./customer-dto-transformers";

export class CreateCustomerContactDto {
  @ApiProperty({ example: "Joao Silva", maxLength: 200 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ enum: CustomerContactRole, example: CustomerContactRole.Financial })
  @IsOptional()
  @IsEnum(CustomerContactRole)
  role?: CustomerContactRole;

  @ApiPropertyOptional({ example: "joao@acme.com", maxLength: 320 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string;

  @ApiPropertyOptional({ example: "+55 11 98888-0000", maxLength: 50 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: "Finance decision maker.", maxLength: 1_000 })
  @customerDtoTransformers.optionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(1_000)
  notes?: string;
}
