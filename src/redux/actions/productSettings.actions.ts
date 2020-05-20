import {
  OptionGroup,
  ModifiedOptionUnitOrder,
  OptionUnit,
} from './../../interfaces/index';
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
export const changeTargetOptionunit = createAction<OptionUnit | null>(
  productSettingsTypes.CHANGE_TARGET_OPTIONUNIT
);
export const updateOptionUnit = createAction<OptionUnit>(
  productSettingsTypes.UPDATE_OPTION_UNIT
);
export const saveNewOptionUnit = createAction<OptionUnit>(
  productSettingsTypes.SAVE_NEW_OPTION_UNIT
);
export const toggleOptionUnitFormVisibility = createAction<boolean>(
  productSettingsTypes.TOGGLE_OPTION_UNIT_FORM_VISIBILITY
);
export const deleteOptionUnitById = createAction<number>(
  productSettingsTypes.DELETE_OPTION_UNIT_BY_ID
);
export const getAndSelectOptionGroupById = createAction<number>(
  productSettingsTypes.GET_AND_SELECT_OPTION_GROUP_BY_ID
);
export const updateSearchWordOptionGroup = createAction<string>(
  productSettingsTypes.UPDATE_SEARCH_WORD_OPTION_GROUP
);
export const getBySearchOptionGroups = createAction(
  productSettingsTypes.GET_BY_SEARCH_OPTION_GROUPS
);

export type ManagingPanelContent = ReturnType<typeof managingPanelContent>;
export type SaveNewOptionGroup = ReturnType<typeof saveNewOptionGroup>;
export type GetAllOptionGroupsList = ReturnType<typeof getAllOptionGroupsList>;
export type UpdateOptionGroupList = ReturnType<typeof updateOptionGroupList>;
export type ChangeTargetOptionGroupForUnitsEdit = ReturnType<
  typeof changeTargetOptionGroupForUnitsEdit
>;
export type ModifyOptionUnitsOrder = ReturnType<typeof modifyOptionUnitsOrder>;
export type ChangeTargetOptionunit = ReturnType<typeof changeTargetOptionunit>;
export type UpdateOptionUnit = ReturnType<typeof updateOptionUnit>;
export type SaveNewOptionUnit = ReturnType<typeof saveNewOptionUnit>;
export type ToggleOptionUnitFormVisibility = ReturnType<
  typeof toggleOptionUnitFormVisibility
>;
export type DeleteOptionUnitById = ReturnType<typeof deleteOptionUnitById>;
export type GetAndSelectOptionGroupById = ReturnType<
  typeof getAndSelectOptionGroupById
>;
export type UpdateSearchWordOptionGroup = ReturnType<
  typeof updateSearchWordOptionGroup
>;
export type GetBySearchOptionGroups = ReturnType<
  typeof getBySearchOptionGroups
>;
