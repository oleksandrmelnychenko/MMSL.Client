import { DealerDetilsComponents } from '../redux/slices/dealer.slice';

export class FormicReference {
  constructor(isDirtyFunc?: (isDirty: boolean) => void) {
    this.formik = null;
    this.isDirtyFunc = isDirtyFunc;
  }

  formik: any;
  isDirtyFunc?: (isDirty: boolean) => void;
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
