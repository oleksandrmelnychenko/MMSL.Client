import { EntityBase } from './base';

export class DeliveryTimeline extends EntityBase {
  constructor() {
    super();
    this.name = '';
    this.ivory = '';
    this.silver = '';
    this.black = '';
    this.gold = '';
  }
  name: string;
  ivory: string;
  silver: string;
  black: string;
  gold: string;
}

export class ProductDeliveryTimeline extends EntityBase {
  constructor() {
    super();

    this.deliveryTimelines = [];
    this.deliveryTimelineId = 0;
    this.productCategoryId = 0;
  }

  deliveryTimelines: DeliveryTimeline[];
  deliveryTimelineId: number;
  productCategoryId: number;
}

export class ProductDeliveryTimelineSelected extends EntityBase {
  constructor() {
    super();

    this.deliveryTimeline = new DeliveryTimeline();
    this.deliveryTimelineId = 0;
    this.productCategoryId = 0;
  }

  deliveryTimeline: DeliveryTimeline;
  deliveryTimelineId: number;
  productCategoryId: number;
}
