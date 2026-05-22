export type CustomerRemovalDependencyProbe = {
  hasAddressDependencies(addressId: string): Promise<boolean>;
  hasContactDependencies(contactId: string): Promise<boolean>;
};
