export const SERVER_URL = 'http://78.152.175.67:5555/api/v1';

// export const CORS_PROXY_URL = 'http://78.152.175.67:14008';
export const CORS_PROXY_URL = 'https://cors-anywhere.herokuapp.com';

export const PLACES_AUTOCOMLPETE_GOOGLE_API =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
export const GET_DETAILS_BY_PLACE_ID_GOOGLE_API =
  'https://maps.googleapis.com/maps/api/place/details/json';

export const SIGN_IN_API = '/identity/signin';
export const NEW_USER_ACCOUNT_API = '/identity/new/account';
export const ADD_ACCOUNT_TYPE_API = '/account/type/add';
export const UPDATE_COMPANY_INFO_API = '/account/type/info/save';
export const ACCOUNT_TYPE_API = '/account/company/get';

export const GET_APPLES_API = '/apples/get';
export const ADD_SORT_API = '/apples/add';
export const UPDATE_VARIETIES_API = '/apples/update/selection';
export const PUT_UPDATE_SINGLE_VARIETY_API = '/apples/update';
export const GET_VARIETIES_COUNT_API = '/dashboard/apples/varieties/count';

export const GET_TERRITORY_COORDS_BY_DEVICE_NAME = '/coordinates/routes/get';

export const CREATE_NEW_DRONE = '/drones/add';
export const DELETE_DRONE_BY_ID = '/drones/delete';
export const UPDATE_DRONE = '/drones/update';
export const GET_ALL_DRONES = '/drones/get/all';
export const GET_DRONE_BY_ID = '/drones/get';
export const GET_FLYING_SESSION_BY_DRONE_ID =
  '/drone/activities/flying/session/active/by/drone';
export const START_FLYING_SESSION = '/drone/commands/flying/takeoff';
export const STOP_FLYING_SESSION = '/drone/commands/flying/landing';
