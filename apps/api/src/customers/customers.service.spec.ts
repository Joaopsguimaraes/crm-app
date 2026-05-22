import { NotFoundException } from "@nestjs/common";
import { CustomerContactRole } from "./enums/customer-contact-role.enum";
import { CustomerStatus } from "./enums/customer-status.enum";
import { CustomersService } from "./customers.service";
import type { CustomerAddress } from "./entities/customer-address.entity";
import type { CustomerContact } from "./entities/customer-contact.entity";
import type { Customer } from "./entities/customer.entity";
import type { CustomerRemovalDependencyProbe } from "./removal/customer-removal-dependency-probe.type";

const now = new Date("2026-05-21T12:00:00.000Z");

describe("CustomersService", () => {
  it("creates a customer with only name and reports missing progressive fields", async () => {
    const customer = makeCustomer({ name: "ACME Ltda" });
    const service = new CustomersService(
      makeCustomerRepository({ savedCustomer: customer }) as never,
      makeContactRepository() as never,
      makeAddressRepository({ count: 0 }) as never,
      makeDependencyProbe()
    );

    const response = await service.createCustomer({ name: "ACME Ltda" });

    expect(response).toMatchObject({
      id: customer.id,
      name: "ACME Ltda",
      status: CustomerStatus.Active,
      completeness: {
        hasPrimaryChannel: false,
        hasAddress: false,
        pending: ["primary_channel", "address"]
      },
      duplicateSignals: []
    });
  });

  it("does not block duplicate names and returns advisory duplicate signals", async () => {
    const duplicate = makeCustomer({ id: "existing-id", name: "ACME Ltda" });
    const customer = makeCustomer({ id: "new-id", name: "ACME Ltda" });
    const service = new CustomersService(
      makeCustomerRepository({ savedCustomer: customer, duplicateCandidates: [duplicate] }) as never,
      makeContactRepository() as never,
      makeAddressRepository({ count: 1 }) as never,
      makeDependencyProbe()
    );

    const response = await service.createCustomer({ name: "ACME Ltda" });

    expect(response.duplicateSignals).toEqual([{ customerId: "existing-id", fields: ["name"] }]);
  });

  it("archives and unarchives customers without blocking maintenance", async () => {
    const customer = makeCustomer({ status: CustomerStatus.Active });
    const customerRepository = makeCustomerRepository({ foundCustomer: customer, savedCustomer: customer });
    const service = new CustomersService(
      customerRepository as never,
      makeContactRepository() as never,
      makeAddressRepository({ count: 0 }) as never,
      makeDependencyProbe()
    );

    const archived = await service.archiveCustomer(customer.id);
    expect(archived.status).toBe(CustomerStatus.Archived);
    expect(archived.archivedAt).toEqual(expect.any(String));

    const updated = await service.updateCustomer(customer.id, { notes: "Corrected while archived" });
    expect(updated.notes).toBe("Corrected while archived");

    const active = await service.unarchiveCustomer(customer.id);
    expect(active.status).toBe(CustomerStatus.Active);
    expect(active.archivedAt).toBeNull();
  });

  it("soft deletes contacts when future dependency probes report dependent records", async () => {
    const contact = makeContact();
    const contacts = makeContactRepository({ foundContact: contact });
    const service = new CustomersService(
      makeCustomerRepository() as never,
      contacts as never,
      makeAddressRepository() as never,
      makeDependencyProbe({ hasContactDependencies: true })
    );

    await service.removeContact(contact.customerId, contact.id);

    expect(contact.deletedAt).toEqual(expect.any(Date));
    expect(contacts.save).toHaveBeenCalledWith(contact);
    expect(contacts.remove).not.toHaveBeenCalled();
  });

  it("rejects contact updates through another customer route", async () => {
    const service = new CustomersService(
      makeCustomerRepository() as never,
      makeContactRepository({ foundContact: null }) as never,
      makeAddressRepository() as never,
      makeDependencyProbe()
    );

    await expect(service.updateContact("other-customer", "contact-id", { name: "New" })).rejects.toBeInstanceOf(
      NotFoundException
    );
  });
});

function makeCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    id: "customer-id",
    name: "Customer",
    status: CustomerStatus.Active,
    email: null,
    phone: null,
    notes: null,
    createdAt: now,
    updatedAt: now,
    archivedAt: null,
    contacts: [],
    addresses: [],
    ...overrides
  };
}

function makeContact(overrides: Partial<CustomerContact> = {}): CustomerContact {
  return {
    id: "contact-id",
    customerId: "customer-id",
    name: "Contact",
    role: CustomerContactRole.Other,
    email: null,
    phone: null,
    notes: null,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides
  } as CustomerContact;
}

function makeCustomerRepository(options: {
  duplicateCandidates?: Customer[];
  foundCustomer?: Customer | null;
  savedCustomer?: Customer;
} = {}): Record<string, jest.Mock> {
  return {
    create: jest.fn((input: Partial<Customer>) => makeCustomer(input)),
    save: jest.fn((customer: Customer) => {
      Object.assign(customer, options.savedCustomer ?? customer);
      return Promise.resolve(customer);
    }),
    findOneBy: jest.fn(() => Promise.resolve(options.foundCustomer ?? options.savedCustomer ?? makeCustomer())),
    find: jest.fn(() => Promise.resolve(options.duplicateCandidates ?? []))
  };
}

function makeContactRepository(options: { foundContact?: CustomerContact | null } = {}): Record<string, jest.Mock> {
  const hasFoundContact = Object.prototype.hasOwnProperty.call(options, "foundContact");

  return {
    create: jest.fn((input: Partial<CustomerContact>) => makeContact(input)),
    save: jest.fn((contact: CustomerContact) => Promise.resolve(contact)),
    remove: jest.fn((contact: CustomerContact) => Promise.resolve(contact)),
    find: jest.fn(() => Promise.resolve([])),
    findOneBy: jest.fn(() => Promise.resolve(hasFoundContact ? options.foundContact : makeContact()))
  };
}

function makeAddressRepository(options: {
  count?: number;
  foundAddress?: CustomerAddress | null;
} = {}): Record<string, jest.Mock> {
  return {
    create: jest.fn((input: Partial<CustomerAddress>) => input),
    save: jest.fn((address: CustomerAddress) => Promise.resolve(address)),
    remove: jest.fn((address: CustomerAddress) => Promise.resolve(address)),
    find: jest.fn(() => Promise.resolve([])),
    findOneBy: jest.fn(() => Promise.resolve(options.foundAddress ?? null)),
    countBy: jest.fn(() => Promise.resolve(options.count ?? 0))
  };
}

function makeDependencyProbe(
  options: { hasAddressDependencies?: boolean; hasContactDependencies?: boolean } = {}
): CustomerRemovalDependencyProbe {
  return {
    hasAddressDependencies: jest.fn(() => Promise.resolve(options.hasAddressDependencies ?? false)),
    hasContactDependencies: jest.fn(() => Promise.resolve(options.hasContactDependencies ?? false))
  };
}
