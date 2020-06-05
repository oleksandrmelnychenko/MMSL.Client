import { createSlice } from '@reduxjs/toolkit';

export class ProductStylePermissionsState {}

const productStylePermissions = createSlice({
  name: 'productStylePermissions',
  initialState: new ProductStylePermissionsState(),

  reducers: {
    apiGetAllStylePermissionsByProductId(state) {
      return state;
    },
  },
});

export const productStylePermissionsActions = productStylePermissions.actions;
export default productStylePermissions.reducer;
