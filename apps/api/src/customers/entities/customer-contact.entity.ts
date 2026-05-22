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
import { CustomerContactRole } from "../enums/customer-contact-role.enum";
import { Customer } from "./customer.entity";

@Entity({ name: "customer_contacts" })
@Index(["customerId", "role"])
export class CustomerContact {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ name: "customer_id", type: "uuid" })
  customerId!: string;

  @ManyToOne(() => Customer, (customer) => customer.contacts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "customer_id" })
  customer!: Customer;

  @Column({ type: "text" })
  name!: string;

  @Column({
    enum: CustomerContactRole,
    enumName: "customer_contact_role",
    type: "enum",
    default: CustomerContactRole.Other
  })
  role!: CustomerContactRole;

  @Index()
  @Column({ type: "text", nullable: true })
  email!: string | null;

  @Index()
  @Column({ type: "text", nullable: true })
  phone!: string | null;

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @Index()
  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
