import type { CustomerRemovalDependencyProbe } from "./customer-removal-dependency-probe.type";

export class NoopCustomerRemovalDependencyProbe implements CustomerRemovalDependencyProbe {
  hasAddressDependencies(_addressId: string): Promise<boolean> {
    void _addressId;
    return Promise.resolve(false);
  }

  hasContactDependencies(_contactId: string): Promise<boolean> {
    void _contactId;
    return Promise.resolve(false);
  }
}
