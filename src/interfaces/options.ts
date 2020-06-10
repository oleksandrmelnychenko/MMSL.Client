import { EntityBaseNamed } from './base';
import { ProductDeliveryTimelineSelected } from './deliveryTimelines';
import { ProductCategory } from './products';
import { Measurement } from './measurements';

export class OptionGroup extends EntityBaseNamed {
  constructor() {
    super();

    this.isMandatory = false;
    this.optionUnits = [];

    this.groupItemVisualState = new GroupItemVisualState();
  }

  isMandatory: boolean;
  optionUnits: OptionUnit[];

  /// Keeps item visual state (is not related to DTO model).
  groupItemVisualState: GroupItemVisualState;
}

export class OptionUnit extends EntityBaseNamed {
  constructor() {
    super();

    this.imageUrl = '';
    this.imageBlob = null;
    this.isMandatory = false;
    this.isAllow = false;
    this.value = '';
    this.orderIndex = 0;
    this.optionGroupId = null;
    this.optionGroup = null;
  }

  orderIndex: number;
  value: string;
  imageUrl: string;
  /// This field is used for just added (not saved) image files. Actual saved image source is provided through `imageUrl`.
  imageBlob: any;
  isMandatory: boolean;
  isAllow: boolean;
  optionGroupId?: number | null;
  optionGroup?: OptionGroup | null;
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

/// Keeps item visual state (is not related to DTO model).
export class GroupItemVisualState {
  constructor() {
    this.isCollapsed = false;
  }

  isCollapsed: boolean;
}
