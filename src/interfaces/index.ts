import { EntityBase } from './base';
import { DealerDetilsComponents } from '../redux/slices/dealer.slice';

export class FormicReference {
  constructor(isDirtyFunc?: (isDirty: boolean) => void) {
    this.formik = null;
    this.isDirtyFunc = isDirtyFunc;
  }

  formik: any;
  isDirtyFunc?: (isDirty: boolean) => void;
}

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
}

export class IPanelInfo {
  constructor() {
    this.isOpenPanelInfo = false;
    this.hasCloseButton = false;
    this.isHasCloseButton = true;

    this.onDismisPendingAction = () => {};
  }

  isOpenPanelInfo: boolean;
  hasCloseButton: boolean;
  componentInPanelInfo: any;
  isHasCloseButton: boolean;

  onDismisPendingAction: () => void;
}

export interface ImenuItem {
  title: string;
  className: string;
  componentType: DealerDetilsComponents;
  onClickAction?: Function;
  isSelected?: boolean;
}

export interface IStore {
  address: Address;
  addressId?: number;
  billingEmail: string;
  contactEmail: string;
  description?: string;
  id?: number;
  isDeleted?: boolean;
  name: string;
  storeCustomersCount?: number;
}

export interface INewStore {
  name: string;
  dealerAccountId: number | null;
  addressId?: number;
  address: IAddress;
  billingEmail: string;
  contactEmail: string;
}

export interface IAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export class Address extends EntityBase {
  constructor() {
    super();

    this.addressLine1 = '';
    this.addressLine2 = '';
    this.city = '';
    this.state = '';
    this.country = '';
    this.zipCode = '';
  }

  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export class Pagination {
  constructor() {
    this.limit = 9999;
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
