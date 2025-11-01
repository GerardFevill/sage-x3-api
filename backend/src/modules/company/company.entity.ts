import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

/**
 * Company Entity
 * Represents a company in the multi-company ERP system
 * This is the central entity that all transactional data references
 */
@Entity('company')
export class Company {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'legal_name' })
  legalName: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'tax_id' })
  taxId: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'registration_number',
  })
  registrationNumber: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'address_line1',
  })
  addressLine1: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'address_line2',
  })
  addressLine2: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'state_province',
  })
  stateProvince: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'postal_code' })
  postalCode: string;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: true,
    name: 'country_code',
    comment: 'ISO 3166-1 alpha-2 country code',
  })
  countryCode: string;

  @Column({
    type: 'bigint',
    nullable: true,
    name: 'default_currency_id',
  })
  defaultCurrencyId: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'bigint', nullable: true, name: 'created_by' })
  createdBy: number;

  @Column({ type: 'bigint', nullable: true, name: 'updated_by' })
  updatedBy: number;

  // Relationships will be added as we create other modules
  // @ManyToOne(() => Currency)
  // @JoinColumn({ name: 'default_currency_id' })
  // defaultCurrency: Currency;

  // @OneToMany(() => FiscalYear, (fiscalYear) => fiscalYear.company)
  // fiscalYears: FiscalYear[];

  // @OneToMany(() => Account, (account) => account.company)
  // accounts: Account[];
}
