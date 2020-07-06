import { EntityBaseNamed, EntityBase } from './base';
import { ProductDeliveryTimelineSelected } from './deliveryTimelines';
import { ProductCategory } from './products';
import { Measurement } from './measurements';
import { CurrencyType } from './currencyTypes';

export class OptionGroup extends EntityBaseNamed {
  constructor() {
    super();

    this.isMandatory = false;
    this.optionUnits = [];

    this.groupItemVisualState = new GroupItemVisualState();

    this.optionPrices = [];
    this.canDeclareOwnPrice = false;

    this.currentPrice = null;
  }

  isMandatory: boolean;
  optionUnits: OptionUnit[];
  optionPrices: OptionPrice[];
  currentPrice: OptionPrice | null | undefined;
  canDeclareOwnPrice: boolean;

  /// Keeps item visual state (is not related to DTO model).
  groupItemVisualState: GroupItemVisualState;
}

export class OptionUnit extends EntityBaseNamed {
  constructor() {
    super();

    this.imageUrl = '';
    this.imageBlob = null;
    this.isMandatory = false;
    this.isBodyPosture = false;
    this.isAllow = false;
    this.value = '';
    this.orderIndex = 0;
    this.optionGroupId = null;
    this.optionGroup = null;

    this.unitValues = [];
    this.optionPrices = [];
    this.currentPrice = null;

    this.canDeclareOwnPrice = false;
  }

  orderIndex: number;
  value: string;
  imageUrl: string;
  /// This field is used for just added (not saved) image files. Actual saved image source is provided through `imageUrl`.
  imageBlob: any;
  isMandatory: boolean;
  isBodyPosture: boolean;
  isAllow: boolean;
  optionGroupId?: number | null;
  optionGroup?: OptionGroup | null;
  unitValues: UnitValue[];
  optionPrices: OptionPrice[];
  currentPrice: OptionPrice | null | undefined;
  canDeclareOwnPrice: boolean;
}

export class UnitValue extends EntityBase {
  constructor() {
    super();

    this.value = '';
    this.optionUnitId = 0;
    this.optionUnit = null;
  }

  value: string;
  optionUnitId: number;
  optionUnit: OptionUnit | null | undefined;
}

export class ModifiedOptionUnitOrder {
  constructor() {
    this.optionUnitId = 0;
    this.orderIndex = 0;
  }

  optionUnitId: number;
  orderIndex: number;
}

export class ChooseOptions {
  constructor() {
    this.category = null;
    this.measurements = [];
    this.selectedTimeline = new ProductDeliveryTimelineSelected();
  }
  category: ProductCategory | null;
  measurements: Measurement[];
  selectedTimeline: ProductDeliveryTimelineSelected;
}

export class OptionPrice extends EntityBase {
  constructor() {
    super();

    this.price = 0;

    this.currencyTypeId = 0;
    this.currencyType = null;

    this.optionGroupId = null;
    this.optionGroup = null;

    this.optionUnitId = null;
    this.optionUnit = null;
  }

  price: number;

  currencyTypeId: number;
  currencyType: CurrencyType | null | undefined;

  optionGroupId: number | null | undefined;
  optionGroup: OptionGroup | null | undefined;

  optionUnitId: number | null | undefined;
  optionUnit: OptionUnit | null | undefined;
}

/// Keeps item visual state (is not related to DTO model).
export class GroupItemVisualState {
  constructor() {
    this.isCollapsed = false;
  }

  isCollapsed: boolean;
}
