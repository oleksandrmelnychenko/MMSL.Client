import { Address } from './addresses';
import { EntityBase } from './base';

export class DealerAccount extends EntityBase {
  constructor() {
    super();

    this.name = '';
    this.companyName = '';
    this.email = '';
    this.alternateEmail = '';
    this.phoneNumber = '';
    this.taxNumber = '';
    this.isVatApplicable = false;
    this.currencyTypeId = 0;
    this.paymentTypeId = 0;
    this.isCreditAllowed = false;
    this.billingAddressId = null;
    this.billingAddress = null;
    this.useBillingAsShipping = false;
    this.shippingAddressId = null;
    this.shippingAddress = null;
    this.stores = [];
    this.tempPassword = '';
  }

  name: string;
  companyName: string;
  email: string;
  alternateEmail: string;
  phoneNumber: string;
  taxNumber: string;
  isVatApplicable: boolean;
  currencyTypeId: number;
  paymentTypeId: number;
  isCreditAllowed: boolean;
  billingAddressId: number | null;
  billingAddress: Address | null;
  useBillingAsShipping: boolean;
  shippingAddressId: number | null;
  shippingAddress: Address | null;
  stores: any[];
  tempPassword: string;
}
