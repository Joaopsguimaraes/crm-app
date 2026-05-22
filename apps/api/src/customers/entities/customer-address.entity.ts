import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { CustomerAddressType } from "../enums/customer-address-type.enum";
import { Customer } from "./customer.entity";

@Entity({ name: "customer_addresses" })
@Index(["customerId", "type"])
@Index("idx_customer_addresses_one_default", ["customerId"], {
  unique: true,
  where: "\"is_default\" = true AND \"deleted_at\" IS NULL"
})
export class CustomerAddress {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ name: "customer_id", type: "uuid" })
  customerId!: string;

  @ManyToOne(() => Customer, (customer) => customer.addresses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "customer_id" })
  customer!: Customer;

  @Column({
    enum: CustomerAddressType,
    enumName: "customer_address_type",
    type: "enum",
    default: CustomerAddressType.Main
  })
  type!: CustomerAddressType;

  @Column({ name: "is_default", type: "boolean", default: false })
  isDefault!: boolean;

  @Column({ type: "text", nullable: true })
  line1!: string | null;

  @Column({ type: "text", nullable: true })
  line2!: string | null;

  @Column({ type: "text", nullable: true })
  city!: string | null;

  @Column({ type: "text", nullable: true })
  state!: string | null;

  @Column({ name: "postal_code", type: "text", nullable: true })
  postalCode!: string | null;

  @Column({ type: "text", nullable: true })
  country!: string | null;

  @Index()
  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
