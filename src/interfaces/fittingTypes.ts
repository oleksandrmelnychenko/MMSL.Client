import { Measurement, MeasurementMapValue } from './measurements';
import { EntityBase, EntityBaseNamed } from './base';

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
