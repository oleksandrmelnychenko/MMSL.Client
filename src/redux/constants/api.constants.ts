export const SERVER_URL = 'http://78.152.175.67:15004/api/v1';
// export const SERVER_URL = 'http://localhost:56542//api/v1';

export const SIGN_IN_API = '/identity/signin';
export const NEW_USER_ACCOUNT_API = '/identity/new/account';

export const CREATE_NEW_DEALER = '/dealer/accounts/add';
export const UPDATE_DEALER = '/dealer/accounts/update';
export const GET_DEALERS_ALL = '/dealer/accounts/get/all';
export const DELETE_DEALER_BY_ID = '/dealer/accounts/delete';
export const GET_DEALER_BY_ID = '/dealer/accounts/get';

export const GET_STORES_BY_DEALER = '/stores/get/all/dealer';
export const GET_ALL_STORES = '/stores/get/all';
export const UPDATE_DEALER_STORE = '/stores/update/store';
export const CREATE_DEALER_STORE = '/stores/new/store';
export const DELETE_CURRENT_DEALER_STORE = '/stores/delete/store';

export const GET_CURRENCIES_ALL = '/types/currency/get';
export const GET_PAYMENT_TYPES_ALL = '/types/payment/get';

export const GET_CUSTOMERS_ALL = '/store/customers/get/all';
export const CREATE_NEW_STORE_CUSTOMER = '/store/customers/add';
export const DELETE_CUSTOMER_FROM_STORE = '/store/customers/delete';
export const UPDATE_STORE_CUSTOMER = '/store/customers/update';

export const CREATE_NEW_OPTION_GROUP = '/options/groups/new/group';
export const GET_ALL_OPTION_GROUPS = '/options/groups/get/all';
export const GET_OPTION_GROUP_BY_ID = '/options/groups/get';
export const DELETE_OPTION_GROUP_BY_ID = '/options/groups/delete/group';
export const UPDATE_OPTION_GROUP = '/options/groups/update/group';

export const MODIFY_OPTION_UNITS_ORDER = '/options/units/update/order/index';
export const MODIFY_OPTION_UNIT = '/options/units/update';
export const ADD_OPTION_UNIT = '/options/units/add';
export const DELETE_OPTION_UNIT_BY_ID = '/options/units/delete';
export const GET_OPTION_UNIT_BY_ID = '/options/units/get';

export const GET_ALL_PRODUCT_CATEGORY = '/product/category/get/all';
export const GET_PRODUCT_CATEGORY_BY_ID =
  '/product/category/get/product/category';
export const ADD_PRODUCT_CATEGORY = '/product/category/new/product/category';
export const UPDATE_PRODUCT_CATEGORY =
  '/product/category/update/product/category';
export const UPDATE_PRODUCT_CATEGORY_GROUPS_LIST =
  '/product/category/update/product/category/option/group';
export const DELETE_PRODUCT_CATEGORY =
  '/product/category/delete/product/category';

export const GET_ALL_MEASUREMENTS = '/measurements/get/all';
export const GET_MEASUREMENT_BY_ID = '/measurements/get/chart';
export const GET_MEASUREMENTS_BY_PRODUCT = '/measurements/by/product';
export const ADD_NEW_MEASUREMENT = '/measurements/new/measurement';
export const DELETE_MEASUREMENT = '/measurements/delete/measurement';

export const GET_ALL_DELIVERY_TIMELINES = '/delivery/timelines/get/all';
export const ADD_DELIVERY_TIMELINE = '/delivery/timelines/new';
export const UPDATE_DELIVERY_TIMELINE = '/delivery/timelines/update';
export const DELETE_DELIVERY_TIMELINE_BY_ID = '/delivery/timelines/delete';
export const UPDATE_MEASUREMENT = '/measurements/update/measurement';
