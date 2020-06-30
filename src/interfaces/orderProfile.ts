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
