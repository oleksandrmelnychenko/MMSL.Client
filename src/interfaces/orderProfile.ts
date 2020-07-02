import { StoreCustomer } from './storeCustomer';
import { DealerAccount } from './dealer';
import {
  MeasurementDefinition,
  Measurement,
  FittingType,
  MeasurementSize,
} from './measurements';
import { EntityBaseNamed, EntityBase } from './base';
import { ProductCategory } from './products';
import { OptionUnit, UnitValue } from './options';

export enum ProfileTypes {
  FreshMeasurement = 0,
  BaseMeasurement = 1,
  BodyMeasurement = 2,
  Reference = 3,
}

export class CustomerProductProfile extends EntityBaseNamed {
  constructor() {
    super();

    this.profileType = ProfileTypes.FreshMeasurement;

    this.dealerAccountId = 0;
    this.dealerAccount = null;

    this.storeCustomerId = 0;
    this.storeCustomer = null;

    this.productCategoryId = 0;
    this.productCategory = null;

    this.measurementId = 0;
    this.measurement = null;

    this.fittingTypeId = 0;
    this.fittingType = null;

    this.measurementSizeId = 0;
    this.measurementSize = null;

    this.customerProfileSizeValues = [];

    this.customerProfileStyleConfigurations = [];
  }

  profileType: ProfileTypes;

  dealerAccountId: number;
  dealerAccount: DealerAccount | null | undefined;

  storeCustomerId: number;
  storeCustomer: StoreCustomer | null | undefined;

  productCategoryId: number;
  productCategory: ProductCategory | null | undefined;

  measurementId: number | null | undefined;
  measurement: Measurement | null | undefined;

  fittingTypeId: number | null | undefined;
  fittingType: FittingType | null | undefined;

  measurementSizeId: number | null | undefined;
  measurementSize: MeasurementSize | null | undefined;

  customerProfileSizeValues: CustomerProfileSizeValue[];

  customerProfileStyleConfigurations: CustomerProfileStyleConfiguration[];
}

export class CustomerProfileSizeValue extends EntityBase {
  constructor() {
    super();

    this.value = null;
    this.fittingValue = null;

    this.measurementDefinitionId = 0;
    this.measurementDefinition = null;

    this.customerProductProfileId = 0;
    this.customerProductProfile = null;
  }

  /// Body measurement
  value: number | null;

  /// Add to body measurement
  fittingValue: number | null;

  measurementDefinitionId: number;
  measurementDefinition: MeasurementDefinition | null | undefined;

  customerProductProfileId: number;
  customerProductProfile: CustomerProductProfile | null | undefined;
}

export class CustomerProfileStyleConfiguration extends EntityBase {
  constructor() {
    super();

    this.unitValueId = 0;
    this.unitValue = null;

    this.optionUnitId = 0;
    this.optionUnit = null;

    this.customerProductProfileId = 0;
  }

  unitValueId: number | null | undefined;
  unitValue: UnitValue | null | undefined;

  optionUnitId: number;
  optionUnit: OptionUnit | null | undefined;

  customerProductProfileId: number;
  customerProductProfile: CustomerProductProfile | null | undefined;
}

export interface IUpdateOrderProfileDetailsPayload {
  measurementId: number;
  fittingTypeId: number;
  productCategoryId: number;
  measurementSizeId: number;
  profileType: number;
  name: string;
  description: string;
  id: number;
  storeCustomerId: number;
}

export interface ICreateOrderProfilePayload {
  productCategoryId: number;
  measurementId: number;
  fittingTypeId: number;
  measurementSizeId: number;
  profileType: number;
  values: IMeasurementValuePayload[];
  productStyles: IProductStyleValuePayload[];
  name: string;
  description: string;
  id: number;
  storeCustomerId: number;
}

export interface IUpdateOrderProfilePayload {
  measurementId: number;
  fittingTypeId: number;
  measurementSizeId: number;
  profileType: number;
  values: IMeasurementValuePayload[];
  productStyles: IProductStyleValuePayload[];
  name: string;
  description: string;
  id: number;
  storeCustomerId: number;
}

export interface IMeasurementValuePayload {
  value: string;
  fittingValue: string;
  measurementDefinitionId: number;
  id: number;
}

export interface IProductStyleValuePayload {
  id: number;
  isDeleted: boolean;
  selectedStyleValueId: number;
  optionUnitId: number;
}
