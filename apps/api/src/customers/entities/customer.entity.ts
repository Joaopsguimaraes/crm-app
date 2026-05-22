import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { CustomerStatus } from "../enums/customer-status.enum";
import { CustomerAddress } from "./customer-address.entity";
import { CustomerContact } from "./customer-contact.entity";

@Entity({ name: "customers" })
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "text" })
  name!: string;

  @Index()
  @Column({
    enum: CustomerStatus,
    enumName: "customer_status",
    type: "enum",
    default: CustomerStatus.Active
  })
  status!: CustomerStatus;

  @Index()
  @Column({ type: "text", nullable: true })
  email!: string | null;

  @Index()
  @Column({ type: "text", nullable: true })
  phone!: string | null;

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @Index()
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "archived_at", type: "timestamptz", nullable: true })
  archivedAt!: Date | null;

  @OneToMany(() => CustomerContact, (contact) => contact.customer)
  contacts!: CustomerContact[];

  @OneToMany(() => CustomerAddress, (address) => address.customer)
  addresses!: CustomerAddress[];
}
