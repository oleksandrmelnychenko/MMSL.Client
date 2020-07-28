export const SERVER_URL = 'http://78.152.175.67:15004/api/v1';
// export const SERVER_URL = 'http://localhost:56542/api/v1';

export const SIGN_IN_API = '/identity/signin';
export const NEW_USER_ACCOUNT_API = '/identity/new/account';
export const GENERATE_PASSWORD = '/identity/generate/password';

export const CREATE_NEW_DEALER = '/dealer/accounts/add';
export const UPDATE_DEALER = '/dealer/accounts/update';
export const GET_DEALERS_ALL = '/dealer/accounts/get/all';
export const DELETE_DEALER_BY_ID = '/dealer/accounts/delete';
export const GET_DEALER_BY_ID = '/dealer/accounts/get';
export const GET_DEALERS_BY_PERMISSION_ID =
  '/dealer/accounts/get/by/permission';
export const SEARCH_DEALERS_BY_PERMISSION_PRODUCT_ID =
  '/dealer/accounts/search';

export const GET_STORES_BY_DEALER = '/stores/get/all/dealer';
export const GET_ALL_STORES = '/stores/get/all';
export const UPDATE_DEALER_STORE = '/stores/update/store';
export const CREATE_DEALER_STORE = '/stores/new/store';
export const DELETE_CURRENT_DEALER_STORE = '/stores/delete/store';

export const GET_CURRENCIES_ALL = '/types/currency/get';
export const GET_PAYMENT_TYPES_ALL = '/types/payment/get';

export const GET_CUSTOMERS_ALL = '/store/customers/get/all';
export const GET_CUSTOMER_BY_ID = '/store/customers/get';
export const CREATE_NEW_STORE_CUSTOMER = '/store/customers/add';
export const DELETE_CUSTOMER_BY_ID = '/store/customers/delete';
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
export const GET_ALL_MEASUREMENTS_BY_PRODUCT = '/measurements/by/product';
export const GET_MEASUREMENT_BY_ID = '/measurements/get/chart';
export const GET_MEASUREMENTS_BY_PRODUCT = '/measurements/by/product';
export const ADD_NEW_MEASUREMENT = '/measurements/new/measurement';
export const DELETE_MEASUREMENT = '/measurements/delete/measurement';

export const GET_ALL_DELIVERY_TIMELINES = '/delivery/timelines/get/all';
export const ADD_DELIVERY_TIMELINE = '/delivery/timelines/new';
export const UPDATE_DELIVERY_TIMELINE = '/delivery/timelines/update';
export const DELETE_DELIVERY_TIMELINE_BY_ID = '/delivery/timelines/delete';
export const PRODUCT_DELIVERY_TIMELINE_ASSIGN = '/delivery/timelines/assign';
export const UPDATE_MEASUREMENT = '/measurements/update/measurement';

export const CREATE_MEASUREMENT_SIZE = '/measurements/sizes/add';
export const UPDATE_MEASUREMENT_SIZE = '/measurements/sizes/update';
export const DELETE_MEASUREMENT_SIZE = '/measurements/sizes/delete';

export const GET_ALL_PERMISSION_SETTINGS_BY_PRODUCT_ID =
  '/product/permissions/get/by/product';
export const CREATE_NEW_PERMISSION = '/product/permissions/add';
export const UPDATE_PERMISSION = '/product/permissions/update';
export const DELETE_PERMISSION = '/product/permissions/delete';
export const GET_PERMISSION_BY_ID = '/product/permissions/get/by/id';
export const GET_OPTION_GROUPS_FROM_PERMISSION_PERSPECTIVE =
  '/product/permissions/get/options';
export const BIND_DEALERS_TO_PERMISSION = '/product/permissions/bind/dealers';

export const GET_DEALER_PRODUCTS_WITH_AVAILABILITY =
  '/product/category/get/availability';
export const UPDATE_DEALER_PRODUCTS_AVAILABILITY = '/product/availability/save';

export const GET_ALL_ORDER_PROFILES =
  '/store/customers/product/profile/get/all';
export const CREATE_ORDER_PROFILE = '/store/customers/product/profile/add';
export const DELETE_ORDER_PROFILE = '/store/customers/product/profile/delete';
export const GET_ORDER_PROFILE_BY_ID = '/store/customers/product/profile/get';
export const UPDATE_ORDER_PROFILE = '/store/customers/product/profile/update';
export const GET_PRODUCT_PROFILES_BY_CUSTOMER_ID =
  '/product/category/customer/profiles';
