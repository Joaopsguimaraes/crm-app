import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";
import { CustomerAddress } from "./entities/customer-address.entity";
import { CustomerContact } from "./entities/customer-contact.entity";
import { Customer } from "./entities/customer.entity";
import { CUSTOMER_REMOVAL_DEPENDENCY_PROBE } from "./removal/customer-removal-dependency-probe.token";
import { NoopCustomerRemovalDependencyProbe } from "./removal/noop-customer-removal-dependency.probe";

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerContact, CustomerAddress])],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    {
      provide: CUSTOMER_REMOVAL_DEPENDENCY_PROBE,
      useClass: NoopCustomerRemovalDependencyProbe
    }
  ],
  exports: [CustomersService]
})
export class CustomersModule {}
