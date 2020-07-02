import { EntityBase, EntityBaseNamed } from './base';
import { OptionGroup, OptionUnit } from './options';
import { ProductDeliveryTimeline } from './deliveryTimelines';
import { CustomerProductProfile } from './orderProfile';

export class ProductCategory extends EntityBaseNamed {
  constructor() {
    super();
    this.deliveryTimelineProductMaps = [];
    this.measurements = null;
    this.optionGroupMaps = [];
    this.imageUrl = '';
    this.isDisabled = false;

    this.imageBlob = null;

    this.customerProductProfiles = [];
  }

  deliveryTimelineProductMaps: ProductDeliveryTimeline[];
  imageUrl: string;
  measurements: null;
  optionGroupMaps: ProductCategoryMapOptionGroup[];
  /// Describes availability of the product for dealers.
  isDisabled: boolean;

  customerProductProfiles: CustomerProductProfile[];

  /// This field is used for just added (not saved) image files. Actual saved image source is provided through `imageUrl`.
  imageBlob: any;
}

export class PermissionSettings extends EntityBase {
  constructor() {
    super();

    this.isAllow = false;

    this.productPermissionSettingsId = 0;
    this.productPermissionSettings = null;

    this.optionGroupId = 0;
    this.optionGroup = null;

    this.uptionUnitId = null;
    this.optionUnit = null;
  }

  isAllow: boolean;
  productPermissionSettingsId: number;
  productPermissionSettings: ProductPermissionSettings | null | undefined;

  optionGroupId: number;
  optionGroup: OptionGroup | null | undefined;

  uptionUnitId: number | null | undefined;
  optionUnit: OptionUnit | null | undefined;
}

export class ProductPermissionSettings extends EntityBaseNamed {
  constructor() {
    super();

    this.productCategoryId = 0;
    this.productCategory = null;
    this.permissionSettings = [];
    this.dealersAppliedCount = 0;
  }

  productCategoryId: number;
  productCategory: ProductCategory | null | undefined;
  permissionSettings: PermissionSettings[];
  dealersAppliedCount: number;
}

export class ProductCategoryMapOptionGroup extends EntityBase {
  constructor() {
    super();

    this.productCategoryId = 0;
    this.optionGroupId = 0;
  }

  productCategoryId: number;
  productCategory: ProductCategory | null | undefined;

  optionGroupId: number;
  optionGroup: OptionGroup | null | undefined;
}
