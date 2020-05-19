import { OptionGroup, ModifiedOptionUnitOrder } from './../../interfaces/index';
import { createAction } from '@reduxjs/toolkit';
import * as productSettingsTypes from '../constants/productSettings.types.constants';
import { ManagingPanelComponent } from '../reducers/productSettings.reducer';

export const managingPanelContent = createAction<ManagingPanelComponent | null>(
  productSettingsTypes.MANAGING_PANEL_CONTENT
);
export const saveNewOptionGroup = createAction<OptionGroup>(
  productSettingsTypes.SAVE_NEW_OPTION_GROUP
);
export const getAllOptionGroupsList = createAction(
  productSettingsTypes.GET_ALL_OPTION_GROUPS_LIST
);
export const updateOptionGroupList = createAction<OptionGroup[]>(
  productSettingsTypes.UPDATE_OPTION_GROUP_LIST
);
export const changeTargetOptionGroupForUnitsEdit = createAction<OptionGroup | null>(
  productSettingsTypes.CHANGE_TARGET_OPTION_GROUP_FOR_UNITS_EDIT
);
export const modifyOptionUnitsOrder = createAction<ModifiedOptionUnitOrder[]>(
  productSettingsTypes.MODIFY_OPTION_UNITS_ORDER
);

export type ManagingPanelContent = ReturnType<typeof managingPanelContent>;
export type SaveNewOptionGroup = ReturnType<typeof saveNewOptionGroup>;
export type GetAllOptionGroupsList = ReturnType<typeof getAllOptionGroupsList>;
export type UpdateOptionGroupList = ReturnType<typeof updateOptionGroupList>;
export type ChangeTargetOptionGroupForUnitsEdit = ReturnType<
  typeof changeTargetOptionGroupForUnitsEdit
>;
export type ModifyOptionUnitsOrder = ReturnType<typeof modifyOptionUnitsOrder>;
