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

export class Pagination {
  constructor() {
    this.limit = 100;
    this.paginationInfo = new PaginationInfo();
    // this.paginationInfo.pageNumber = 1;
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

export class ExpandableItem {
  constructor() {
    this.item = null;
    this.expandKey = '';
    this.isExpanded = false;
  }

  expandKey: string;
  item: any;
  isExpanded: boolean;
}
