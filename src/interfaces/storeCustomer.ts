import { Address } from './addresses';
import { IStore } from './store';
import { EntityBase } from './base';

export class StoreCustomer extends EntityBase {
  constructor() {
    super();
    this.userName = '';
    this.customerName = '';
    this.email = '';
    this.phoneNumber = '';
    this.birthDate = '';
    this.useBillingAsDeliveryAddress = false;
    this.billingAddressId = null;
    this.billingAddress = null;
    this.deliveryAddressId = null;
    this.deliveryAddress = null;
    this.storeId = null;
    this.store = null;
  }

  userName: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  useBillingAsDeliveryAddress: boolean;
  billingAddressId: number | null;
  billingAddress: Address | null;
  deliveryAddressId: number | null;
  deliveryAddress: Address | null;
  storeId?: number | null;
  store: IStore | null;
}
