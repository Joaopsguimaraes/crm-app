import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from "@nestjs/swagger";
import { CustomersService } from "./customers.service";
import { CreateCustomerAddressDto } from "./dto/create-customer-address.dto";
import { CreateCustomerContactDto } from "./dto/create-customer-contact.dto";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { ListCustomersQueryDto } from "./dto/list-customers-query.dto";
import { UpdateCustomerAddressDto } from "./dto/update-customer-address.dto";
import { UpdateCustomerContactDto } from "./dto/update-customer-contact.dto";
import { UpdateCustomerStatusDto } from "./dto/update-customer-status.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { CustomerAddressResponse } from "./responses/customer-address.response";
import { CustomerContactResponse } from "./responses/customer-contact.response";
import { CustomerListResponse } from "./responses/customer-list.response";
import { CustomerResponse } from "./responses/customer.response";

@ApiTags("customers")
@Controller("customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: "Create a customer" })
  @ApiCreatedResponse({ description: "Customer created.", type: CustomerResponse })
  @ApiBadRequestResponse({ description: "Invalid customer input." })
  createCustomer(@Body() dto: CreateCustomerDto): Promise<CustomerResponse> {
    return this.customersService.createCustomer(dto);
  }

  @Get()
  @ApiOperation({ summary: "List customers" })
  @ApiOkResponse({ description: "Customers returned.", type: CustomerListResponse })
  @ApiBadRequestResponse({ description: "Invalid customer query." })
  listCustomers(@Query() query: ListCustomersQueryDto): Promise<CustomerListResponse> {
    return this.customersService.listCustomers(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a customer" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiOkResponse({ description: "Customer returned.", type: CustomerResponse })
  @ApiBadRequestResponse({ description: "Invalid customer ID." })
  @ApiNotFoundResponse({ description: "Customer not found." })
  getCustomer(@Param("id", ParseUUIDPipe) id: string): Promise<CustomerResponse> {
    return this.customersService.getCustomer(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a customer" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiOkResponse({ description: "Customer updated.", type: CustomerResponse })
  @ApiBadRequestResponse({ description: "Invalid customer input or ID." })
  @ApiNotFoundResponse({ description: "Customer not found." })
  updateCustomer(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto
  ): Promise<CustomerResponse> {
    return this.customersService.updateCustomer(id, dto);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update a customer status" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiOkResponse({ description: "Customer status updated.", type: CustomerResponse })
  @ApiBadRequestResponse({ description: "Invalid status input or customer ID." })
  @ApiNotFoundResponse({ description: "Customer not found." })
  updateCustomerStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerStatusDto
  ): Promise<CustomerResponse> {
    return this.customersService.updateCustomerStatus(id, dto.status);
  }

  @Post(":id/archive")
  @ApiOperation({ summary: "Archive a customer" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiCreatedResponse({ description: "Customer archived.", type: CustomerResponse })
  @ApiBadRequestResponse({ description: "Invalid customer ID." })
  @ApiNotFoundResponse({ description: "Customer not found." })
  archiveCustomer(@Param("id", ParseUUIDPipe) id: string): Promise<CustomerResponse> {
    return this.customersService.archiveCustomer(id);
  }

  @Post(":id/unarchive")
  @ApiOperation({ summary: "Unarchive a customer" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiCreatedResponse({ description: "Customer unarchived.", type: CustomerResponse })
  @ApiBadRequestResponse({ description: "Invalid customer ID." })
  @ApiNotFoundResponse({ description: "Customer not found." })
  unarchiveCustomer(@Param("id", ParseUUIDPipe) id: string): Promise<CustomerResponse> {
    return this.customersService.unarchiveCustomer(id);
  }

  @Post(":id/contacts")
  @ApiOperation({ summary: "Create a customer contact" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiCreatedResponse({ description: "Customer contact created.", type: CustomerContactResponse })
  @ApiBadRequestResponse({ description: "Invalid contact input or customer ID." })
  @ApiNotFoundResponse({ description: "Customer not found." })
  createContact(
    @Param("id", ParseUUIDPipe) customerId: string,
    @Body() dto: CreateCustomerContactDto
  ): Promise<CustomerContactResponse> {
    return this.customersService.createContact(customerId, dto);
  }

  @Get(":id/contacts")
  @ApiOperation({ summary: "List customer contacts" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiOkResponse({ description: "Customer contacts returned.", type: [CustomerContactResponse] })
  @ApiBadRequestResponse({ description: "Invalid customer ID." })
  @ApiNotFoundResponse({ description: "Customer not found." })
  listContacts(@Param("id", ParseUUIDPipe) customerId: string): Promise<CustomerContactResponse[]> {
    return this.customersService.listContacts(customerId);
  }

  @Patch(":id/contacts/:contactId")
  @ApiOperation({ summary: "Update a customer contact" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiParam({ name: "contactId", description: "Customer contact ID.", format: "uuid" })
  @ApiOkResponse({ description: "Customer contact updated.", type: CustomerContactResponse })
  @ApiBadRequestResponse({ description: "Invalid contact input, customer ID, or contact ID." })
  @ApiNotFoundResponse({ description: "Customer or contact not found." })
  updateContact(
    @Param("id", ParseUUIDPipe) customerId: string,
    @Param("contactId", ParseUUIDPipe) contactId: string,
    @Body() dto: UpdateCustomerContactDto
  ): Promise<CustomerContactResponse> {
    return this.customersService.updateContact(customerId, contactId, dto);
  }

  @Delete(":id/contacts/:contactId")
  @HttpCode(204)
  @ApiOperation({ summary: "Remove a customer contact" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiParam({ name: "contactId", description: "Customer contact ID.", format: "uuid" })
  @ApiNoContentResponse({ description: "Customer contact removed." })
  @ApiBadRequestResponse({ description: "Invalid customer ID or contact ID." })
  @ApiNotFoundResponse({ description: "Customer or contact not found." })
  removeContact(
    @Param("id", ParseUUIDPipe) customerId: string,
    @Param("contactId", ParseUUIDPipe) contactId: string
  ): Promise<void> {
    return this.customersService.removeContact(customerId, contactId);
  }

  @Post(":id/addresses")
  @ApiOperation({ summary: "Create a customer address" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiCreatedResponse({ description: "Customer address created.", type: CustomerAddressResponse })
  @ApiBadRequestResponse({ description: "Invalid address input or customer ID." })
  @ApiNotFoundResponse({ description: "Customer not found." })
  createAddress(
    @Param("id", ParseUUIDPipe) customerId: string,
    @Body() dto: CreateCustomerAddressDto
  ): Promise<CustomerAddressResponse> {
    return this.customersService.createAddress(customerId, dto);
  }

  @Get(":id/addresses")
  @ApiOperation({ summary: "List customer addresses" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiOkResponse({ description: "Customer addresses returned.", type: [CustomerAddressResponse] })
  @ApiBadRequestResponse({ description: "Invalid customer ID." })
  @ApiNotFoundResponse({ description: "Customer not found." })
  listAddresses(@Param("id", ParseUUIDPipe) customerId: string): Promise<CustomerAddressResponse[]> {
    return this.customersService.listAddresses(customerId);
  }

  @Patch(":id/addresses/:addressId")
  @ApiOperation({ summary: "Update a customer address" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiParam({ name: "addressId", description: "Customer address ID.", format: "uuid" })
  @ApiOkResponse({ description: "Customer address updated.", type: CustomerAddressResponse })
  @ApiBadRequestResponse({ description: "Invalid address input, customer ID, or address ID." })
  @ApiNotFoundResponse({ description: "Customer or address not found." })
  updateAddress(
    @Param("id", ParseUUIDPipe) customerId: string,
    @Param("addressId", ParseUUIDPipe) addressId: string,
    @Body() dto: UpdateCustomerAddressDto
  ): Promise<CustomerAddressResponse> {
    return this.customersService.updateAddress(customerId, addressId, dto);
  }

  @Delete(":id/addresses/:addressId")
  @HttpCode(204)
  @ApiOperation({ summary: "Remove a customer address" })
  @ApiParam({ name: "id", description: "Customer ID.", format: "uuid" })
  @ApiParam({ name: "addressId", description: "Customer address ID.", format: "uuid" })
  @ApiNoContentResponse({ description: "Customer address removed." })
  @ApiBadRequestResponse({ description: "Invalid customer ID or address ID." })
  @ApiNotFoundResponse({ description: "Customer or address not found." })
  removeAddress(
    @Param("id", ParseUUIDPipe) customerId: string,
    @Param("addressId", ParseUUIDPipe) addressId: string
  ): Promise<void> {
    return this.customersService.removeAddress(customerId, addressId);
  }
}
