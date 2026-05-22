import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, IsNull, Not, Repository } from "typeorm";
import { CustomerAddressType } from "./enums/customer-address-type.enum";
import { CustomerContactRole } from "./enums/customer-contact-role.enum";
import { CustomerStatus } from "./enums/customer-status.enum";
import type { CustomerResponse } from "./responses/customer.response";
import type { CreateCustomerAddressDto } from "./dto/create-customer-address.dto";
import type { CreateCustomerContactDto } from "./dto/create-customer-contact.dto";
import type { CreateCustomerDto } from "./dto/create-customer.dto";
import type { ListCustomersQueryDto } from "./dto/list-customers-query.dto";
import type { UpdateCustomerAddressDto } from "./dto/update-customer-address.dto";
import type { UpdateCustomerContactDto } from "./dto/update-customer-contact.dto";
import type { UpdateCustomerDto } from "./dto/update-customer.dto";
import { CustomerAddress } from "./entities/customer-address.entity";
import { CustomerContact } from "./entities/customer-contact.entity";
import { Customer } from "./entities/customer.entity";
import { CUSTOMER_REMOVAL_DEPENDENCY_PROBE } from "./removal/customer-removal-dependency-probe.token";
import type { CustomerRemovalDependencyProbe } from "./removal/customer-removal-dependency-probe.type";
import type { CustomerAddressResponse } from "./responses/customer-address.response";
import type { CustomerCompleteness } from "./responses/customer-completeness.response";
import type { CustomerContactResponse } from "./responses/customer-contact.response";
import type { CustomerDuplicateSignal } from "./responses/customer-duplicate-signal.response";
import type { CustomerListResponse } from "./responses/customer-list.response";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
    @InjectRepository(CustomerContact)
    private readonly contacts: Repository<CustomerContact>,
    @InjectRepository(CustomerAddress)
    private readonly addresses: Repository<CustomerAddress>,
    @Inject(CUSTOMER_REMOVAL_DEPENDENCY_PROBE)
    private readonly removalDependencyProbe: CustomerRemovalDependencyProbe
  ) {}

  async createCustomer(dto: CreateCustomerDto): Promise<CustomerResponse> {
    const customer = this.customers.create({
      name: dto.name,
      status: CustomerStatus.Active,
      email: toNullable(dto.email),
      phone: toNullable(dto.phone),
      notes: toNullable(dto.notes),
      archivedAt: null
    });

    const saved = await this.customers.save(customer);

    return this.toCustomerResponse(saved);
  }

  async listCustomers(query: ListCustomersQueryDto): Promise<CustomerListResponse> {
    const page = query.page ?? DEFAULT_PAGE;
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
    const statuses = this.resolveListStatuses(query);
    const sort = query.sort ?? "name";
    const queryBuilder = this.customers
      .createQueryBuilder("customer")
      .where("customer.status IN (:...statuses)", { statuses })
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (query.search) {
      const search = `%${query.search.toLowerCase()}%`;
      queryBuilder.andWhere(
        new Brackets((where) => {
          where
            .where("LOWER(customer.name) LIKE :search", { search })
            .orWhere("LOWER(customer.email) LIKE :search", { search })
            .orWhere("LOWER(customer.phone) LIKE :search", { search });
        })
      );
    }

    if (sort === "createdAt") {
      queryBuilder.orderBy("customer.createdAt", "DESC").addOrderBy("customer.id", "ASC");
    } else {
      queryBuilder.orderBy("LOWER(customer.name)", "ASC").addOrderBy("customer.id", "ASC");
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: await Promise.all(data.map((customer) => this.toCustomerResponse(customer))),
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    };
  }

  async getCustomer(id: string): Promise<CustomerResponse> {
    return this.toCustomerResponse(await this.findCustomerOrFail(id));
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto): Promise<CustomerResponse> {
    const customer = await this.findCustomerOrFail(id);

    assignIfDefined(customer, "name", dto.name);
    assignIfDefined(customer, "email", toNullable(dto.email));
    assignIfDefined(customer, "phone", toNullable(dto.phone));
    assignIfDefined(customer, "notes", toNullable(dto.notes));

    return this.toCustomerResponse(await this.customers.save(customer));
  }

  async updateCustomerStatus(id: string, status: CustomerStatus): Promise<CustomerResponse> {
    const customer = await this.findCustomerOrFail(id);
    customer.status = status;
    customer.archivedAt = status === CustomerStatus.Archived ? (customer.archivedAt ?? new Date()) : null;

    return this.toCustomerResponse(await this.customers.save(customer));
  }

  async archiveCustomer(id: string): Promise<CustomerResponse> {
    return this.updateCustomerStatus(id, CustomerStatus.Archived);
  }

  async unarchiveCustomer(id: string): Promise<CustomerResponse> {
    return this.updateCustomerStatus(id, CustomerStatus.Active);
  }

  async createContact(customerId: string, dto: CreateCustomerContactDto): Promise<CustomerContactResponse> {
    await this.findCustomerOrFail(customerId);

    const contact = this.contacts.create({
      customerId,
      name: dto.name,
      role: dto.role ?? CustomerContactRole.Other,
      email: toNullable(dto.email),
      phone: toNullable(dto.phone),
      notes: toNullable(dto.notes),
      deletedAt: null
    });

    return toContactResponse(await this.contacts.save(contact));
  }

  async listContacts(customerId: string): Promise<CustomerContactResponse[]> {
    await this.findCustomerOrFail(customerId);
    const contacts = await this.contacts.find({
      where: { customerId, deletedAt: IsNull() },
      order: { createdAt: "ASC", id: "ASC" }
    });

    return contacts.map(toContactResponse);
  }

  async updateContact(
    customerId: string,
    contactId: string,
    dto: UpdateCustomerContactDto
  ): Promise<CustomerContactResponse> {
    const contact = await this.findContactOrFail(customerId, contactId);

    assignIfDefined(contact, "name", dto.name);
    assignIfDefined(contact, "role", dto.role);
    assignIfDefined(contact, "email", toNullable(dto.email));
    assignIfDefined(contact, "phone", toNullable(dto.phone));
    assignIfDefined(contact, "notes", toNullable(dto.notes));

    return toContactResponse(await this.contacts.save(contact));
  }

  async removeContact(customerId: string, contactId: string): Promise<void> {
    const contact = await this.findContactOrFail(customerId, contactId);

    if (await this.removalDependencyProbe.hasContactDependencies(contact.id)) {
      contact.deletedAt = new Date();
      await this.contacts.save(contact);
      return;
    }

    await this.contacts.remove(contact);
  }

  async createAddress(customerId: string, dto: CreateCustomerAddressDto): Promise<CustomerAddressResponse> {
    await this.findCustomerOrFail(customerId);
    const address = this.addresses.create({
      customerId,
      type: dto.type ?? CustomerAddressType.Main,
      isDefault: dto.isDefault ?? false,
      line1: toNullable(dto.line1),
      line2: toNullable(dto.line2),
      city: toNullable(dto.city),
      state: toNullable(dto.state),
      postalCode: toNullable(dto.postalCode),
      country: toNullable(dto.country),
      deletedAt: null
    });

    if (address.isDefault) {
      await this.clearDefaultAddress(customerId);
    }

    return toAddressResponse(await this.addresses.save(address));
  }

  async listAddresses(customerId: string): Promise<CustomerAddressResponse[]> {
    await this.findCustomerOrFail(customerId);
    const addresses = await this.addresses.find({
      where: { customerId, deletedAt: IsNull() },
      order: { isDefault: "DESC", createdAt: "ASC", id: "ASC" }
    });

    return addresses.map(toAddressResponse);
  }

  async updateAddress(
    customerId: string,
    addressId: string,
    dto: UpdateCustomerAddressDto
  ): Promise<CustomerAddressResponse> {
    const address = await this.findAddressOrFail(customerId, addressId);

    assignIfDefined(address, "type", dto.type);
    assignIfDefined(address, "isDefault", dto.isDefault);
    assignIfDefined(address, "line1", toNullable(dto.line1));
    assignIfDefined(address, "line2", toNullable(dto.line2));
    assignIfDefined(address, "city", toNullable(dto.city));
    assignIfDefined(address, "state", toNullable(dto.state));
    assignIfDefined(address, "postalCode", toNullable(dto.postalCode));
    assignIfDefined(address, "country", toNullable(dto.country));

    if (dto.isDefault === true) {
      await this.clearDefaultAddress(customerId, address.id);
    }

    return toAddressResponse(await this.addresses.save(address));
  }

  async removeAddress(customerId: string, addressId: string): Promise<void> {
    const address = await this.findAddressOrFail(customerId, addressId);

    if (await this.removalDependencyProbe.hasAddressDependencies(address.id)) {
      address.deletedAt = new Date();
      await this.addresses.save(address);
      return;
    }

    await this.addresses.remove(address);
  }

  private resolveListStatuses(query: ListCustomersQueryDto): CustomerStatus[] {
    if (query.status && query.status.length > 0) {
      return query.status;
    }

    if (query.includeArchived === true) {
      return [
        CustomerStatus.Active,
        CustomerStatus.Inactive,
        CustomerStatus.Blocked,
        CustomerStatus.Archived
      ];
    }

    return [CustomerStatus.Active];
  }

  private async findCustomerOrFail(id: string): Promise<Customer> {
    const customer = await this.customers.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    return customer;
  }

  private async findContactOrFail(customerId: string, contactId: string): Promise<CustomerContact> {
    const contact = await this.contacts.findOneBy({ id: contactId, customerId, deletedAt: IsNull() });

    if (!contact) {
      throw new NotFoundException("Customer contact not found");
    }

    return contact;
  }

  private async findAddressOrFail(customerId: string, addressId: string): Promise<CustomerAddress> {
    const address = await this.addresses.findOneBy({ id: addressId, customerId, deletedAt: IsNull() });

    if (!address) {
      throw new NotFoundException("Customer address not found");
    }

    return address;
  }

  private async clearDefaultAddress(customerId: string, exceptAddressId?: string): Promise<void> {
    const query = this.addresses
      .createQueryBuilder()
      .update(CustomerAddress)
      .set({ isDefault: false })
      .where("customer_id = :customerId", { customerId })
      .andWhere("deleted_at IS NULL");

    if (exceptAddressId) {
      query.andWhere("id != :exceptAddressId", { exceptAddressId });
    }

    await query.execute();
  }

  private async toCustomerResponse(customer: Customer): Promise<CustomerResponse> {
    const [completeness, duplicateSignals] = await Promise.all([
      this.getCompleteness(customer),
      this.getDuplicateSignals(customer)
    ]);

    return {
      id: customer.id,
      name: customer.name,
      status: customer.status,
      email: customer.email,
      phone: customer.phone,
      notes: customer.notes,
      completeness,
      duplicateSignals,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
      archivedAt: customer.archivedAt?.toISOString() ?? null
    };
  }

  private async getCompleteness(customer: Customer): Promise<CustomerCompleteness> {
    const hasPrimaryChannel = Boolean(customer.email ?? customer.phone);
    const addressCount = await this.addresses.countBy({ customerId: customer.id, deletedAt: IsNull() });
    const hasAddress = addressCount > 0;
    const pending: string[] = [];

    if (!hasPrimaryChannel) {
      pending.push("primary_channel");
    }

    if (!hasAddress) {
      pending.push("address");
    }

    return { hasPrimaryChannel, hasAddress, pending };
  }

  private async getDuplicateSignals(customer: Customer): Promise<CustomerDuplicateSignal[]> {
    const normalizedName = normalize(customer.name);
    const normalizedEmail = normalize(customer.email);
    const normalizedPhone = normalize(customer.phone);

    const candidates = await this.customers.find({
      where: [
        { id: Not(customer.id), name: customer.name },
        ...(customer.email ? [{ id: Not(customer.id), email: customer.email }] : []),
        ...(customer.phone ? [{ id: Not(customer.id), phone: customer.phone }] : [])
      ],
      take: 10
    });

    return candidates
      .map((candidate) => {
        const fields: string[] = [];

        if (normalize(candidate.name) === normalizedName) {
          fields.push("name");
        }

        if (normalizedEmail && normalize(candidate.email) === normalizedEmail) {
          fields.push("email");
        }

        if (normalizedPhone && normalize(candidate.phone) === normalizedPhone) {
          fields.push("phone");
        }

        return { customerId: candidate.id, fields };
      })
      .filter((signal) => signal.fields.length > 0);
  }
}

function toNullable(value: string | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value.length === 0 ? null : value;
}

function assignIfDefined<Entity extends object, Key extends keyof Entity>(
  entity: Entity,
  key: Key,
  value: Entity[Key] | undefined
): void {
  if (value !== undefined) {
    entity[key] = value;
  }
}

function normalize(value: string | null | undefined): string | null {
  return value?.trim().toLowerCase() ?? null;
}

function toContactResponse(contact: CustomerContact): CustomerContactResponse {
  return {
    id: contact.id,
    customerId: contact.customerId,
    name: contact.name,
    role: contact.role,
    email: contact.email,
    phone: contact.phone,
    notes: contact.notes,
    createdAt: contact.createdAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString()
  };
}

function toAddressResponse(address: CustomerAddress): CustomerAddressResponse {
  return {
    id: address.id,
    customerId: address.customerId,
    type: address.type,
    isDefault: address.isDefault,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    createdAt: address.createdAt.toISOString(),
    updatedAt: address.updatedAt.toISOString()
  };
}
