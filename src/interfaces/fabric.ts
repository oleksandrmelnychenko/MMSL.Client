import { UserIdentity } from './identity';
import { EntityBase } from './base';

export enum FabricStatuses {
  InStock = 0,
  OutOfStock = 1,
  Discontinued = 2,
}

export class Fabric extends EntityBase {
  constructor() {
    super();

    this.fabricCode = '';
    this.description = '';
    this.imageUrl = '';

    this.status = FabricStatuses.InStock;

    this.metres = '';
    this.mill = '';
    this.color = '';
    this.composition = '';
    this.gsm = '';
    this.count = 0;
    this.weave = '';
    this.pattern = '';

    this.isMetresVisible = false;
    this.isMillVisible = false;
    this.isColorVisible = false;
    this.isCompositionVisible = false;
    this.isGSMVisible = false;
    this.isCountVisible = false;
    this.isWeaveVisible = false;
    this.isPatternVisible = false;

    this.userIdentityId = 0;
    this.userIdentity = null;
  }

  fabricCode: string;
  description: string;
  imageUrl: string;

  status: FabricStatuses;

  metres: string;
  mill: string;
  color: string;
  composition: string;
  gsm: string;
  count: number;
  weave: string;
  pattern: string;

  isMetresVisible: boolean;
  isMillVisible: boolean;
  isColorVisible: boolean;
  isCompositionVisible: boolean;
  isGSMVisible: boolean;
  isCountVisible: boolean;
  isWeaveVisible: boolean;
  isPatternVisible: boolean;

  userIdentityId: number;
  userIdentity: UserIdentity | null | undefined;
}

export class FabricFilterValue {
  constructor() {
    this.value = '';
    this.applied = false;
  }

  value: string;
  applied: boolean;
}

export class FilterItem {
  constructor() {
    this.name = '';

    this.min = 0;
    this.max = 0;

    this.isRange = false;

    this.values = [];
  }

  name: string;
  min: number;
  max: number;

  isRange: boolean;

  values: FabricFilterValue[];
}
