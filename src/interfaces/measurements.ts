import { ProductCategory } from './products';
import { EntityBase, EntityBaseNamed } from './base';

export class Measurement extends EntityBaseNamed {
  constructor() {
    super();
    this.measurementMapSizes = [];
    this.measurementMapDefinitions = [];
  }

  measurementMapSizes: MeasurementMapSize[];
  measurementMapDefinitions: MeasurementMapDefinition[];
}

export class MeasurementSize extends EntityBaseNamed {
  constructor() {
    super();
    this.measurementMapValues = [];
  }

  measurementMapValues: MeasurementMapValue[];
}

export class MeasurementMapSize extends EntityBase {
  constructor() {
    super();
    this.measurementId = 0;
    this.measurementSizeId = 0;
  }

  measurementId: number;
  measurement: Measurement | null | undefined;

  measurementSizeId: number;
  measurementSize: MeasurementSize | null | undefined;
}

export class MeasurementMapValue extends EntityBaseNamed {
  constructor() {
    super();
    this.value = 0;
  }

  productCategoryId: number | null | undefined;
  productCategory: ProductCategory | null | undefined;

  measurementSizeId: number | null | undefined;
  measurementSize: MeasurementSize | null | undefined;

  measurementDefinitionId: number | null | undefined;
  measurementDefinition: MeasurementDefinition | null | undefined;

  value: number;
}

export class MeasurementSizeValue extends EntityBaseNamed {
  constructor() {
    super();
    this.values = 0;
    this.measurementDefinitionId = 0;
    this.measurementDefinition = null;
    this.measurementSizeId = 0;
    this.measurementSize = null;
  }
  values: number;
  measurementDefinitionId: number;
  measurementDefinition: any;
  measurementSizeId: number;
  measurementSize: any;
}

export class MeasurementMapDefinition extends EntityBaseNamed {
  constructor() {
    super();
    this.measurementDefinition = new MeasurementDefinition();
    this.measurementDefinitionId = 0;
    this.measurementId = 0;
    this.orderIndex = 0;
  }
  measurementDefinition: MeasurementDefinition;
  measurementDefinitionId: number;
  measurementId: number;
  orderIndex: number;
}

export class MeasurementDefinition extends EntityBaseNamed {
  constructor() {
    super();
    this.isDefault = false;
  }

  isDefault: boolean;
}

export class FittingType extends EntityBase {
  constructor() {
    super();

    this.type = '';

    this.measurementUnitId = 0;
    this.measurementUnit = null;

    this.measurementId = 0;
    this.measurement = null;

    this.measurementMapValues = [];
  }

  type: string;

  measurementUnitId: number;
  measurementUnit: MeasurementUnit | null;

  measurementId: number;
  measurement: Measurement | null;

  measurementMapValues: MeasurementMapValue[];
}

export class MeasurementUnit extends EntityBaseNamed {}
