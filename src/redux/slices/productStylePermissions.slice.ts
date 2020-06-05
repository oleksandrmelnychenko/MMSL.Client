import { createSlice } from '@reduxjs/toolkit';
import { ProductPermissionSettings } from '../../interfaces';

export class ProductStylePermissionsState {
  constructor() {
    this.permissionSettings = [];
    this.editingPermissionSetting = null;
  }

  permissionSettings: ProductPermissionSettings[];
  editingPermissionSetting: ProductPermissionSettings | null | undefined;
}

const productStylePermissions = createSlice({
  name: 'productStylePermissions',
  initialState: new ProductStylePermissionsState(),

  reducers: {
    apiGetAllStylePermissionsByProductId(
      state,
      action: { type: string; payload: number }
    ) {},
    apiCreateNewPermission(state, action: any) {},
    updatePermissionSettingsList(
      state,
      action: { type: string; payload: ProductPermissionSettings[] }
    ) {
      state.permissionSettings = action.payload;

      return state;
    },
    changeEditingPermissionSetting(
      state,
      action: {
        type: string;
        payload: ProductPermissionSettings | null | undefined;
      }
    ) {
      state.editingPermissionSetting = action.payload;

      return state;
    },
  },
});

export const productStylePermissionsActions = productStylePermissions.actions;
export default productStylePermissions.reducer;
