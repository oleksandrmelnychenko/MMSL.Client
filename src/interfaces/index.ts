import { isCollapseMenu } from '../redux/actions/control.actions';

export interface IUserInfo {
  userIdentityId: number;
  companyInfoId: number;
  userAccountType: number;
  userIdentity?: any;
  id: string;
  isDeleted?: boolean;
  created?: Date;
  lastModified?: Date;
}

export interface IAuthentication {
  email: string;
  password: string;
}

export interface IFailureAuth {
  isError: boolean;
  errorMessage: string;
}

export interface IAuthState {
  isAuth: boolean;
  errorMessage: string;
  isError: boolean;
  userInfo: IUserInfo;
}

export interface IControlState {
  isCollapseMenu: boolean;
  isOpenPanelInfo: boolean;
  componentInPanelInfo: any;
}

export interface IDealer {
  dealerInfo: string;
  rejected: string;
  processing: string;
  stitching: string;
  stitched: string;
  dispatched: string;
  delivered: string;
}

export class EntityBase {
  constructor() {
    this.id = 0;
    this.isDeleted = false;
  }

  id: number;
  isDeleted: boolean;
}

export interface IStore {
  address: Address;
  addressId: number;
  billingEmail: string;
  contactEmail: string;
  description: string;
  id: number;
  isDeleted: boolean;
  name: string;
}

export class DealerAccount extends EntityBase {
  constructor() {
    super();

    this.companyName = '';
    this.email = '';
    this.alternateEmail = '';
    this.phoneNumber = '';
    this.taxNumber = '';
    this.isVatApplicable = false;
    this.currency = 0;
    this.paymentType = 0;
    this.isCreditAllowed = false;
    this.billingAddressId = null;
    this.billingAddress = null;
    this.useBillingAsShipping = false;
    this.shippingAddressId = null;
    this.shippingAddress = null;
    this.stores = [];
  }

  companyName: string;
  email: string;
  alternateEmail: string;
  phoneNumber: string;
  taxNumber: string;
  isVatApplicable: boolean;
  currency: number;
  paymentType: number;
  isCreditAllowed: boolean;
  billingAddressId: number | null;
  billingAddress: Address | null;
  useBillingAsShipping: boolean;
  shippingAddressId: number | null;
  shippingAddress: Address | null;
  stores: any[];
}

export class Address extends EntityBase {
  constructor() {
    super();

    this.addressLine1 = '';
    this.addressLine2 = '';
    this.city = '';
    this.state = '';
    this.country = '';
    this.zipCode = false;
  }

  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: boolean;
}

export class Pagination {
  constructor() {
    this.limit = 4;
    this.paginationInfo = new PaginationInfo();
    this.paginationInfo.pageNumber = 1;
  }

  limit: number;
  paginationInfo: PaginationInfo;
}

export class PaginationInfo {
  constructor() {
    this.totalItems = 0;
    this.pageSize = 0;
    this.pageNumber = 0;
    this.pagesCount = 0;
  }

  totalItems: number;
  pageSize: number;
  pageNumber: number;
  pagesCount: number;
}
