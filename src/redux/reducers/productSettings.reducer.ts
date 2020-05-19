import { createReducer } from '@reduxjs/toolkit';
import * as productSettingsActions from '../../redux/actions/productSettings.actions';
import { OptionGroup } from '../../interfaces';

export class ProductSettingsState {
  constructor() {
    this.managingPanelContent = null;
    this.optionGroupsList = [];
  }

  managingPanelContent: ManagingPanelComponent | null;
  optionGroupsList: OptionGroup[];
}

export enum ManagingPanelComponent {
  Unknown,
  ManageGroups,
  ManageUnits,
}

export const productSettingsReducer = createReducer(
  new ProductSettingsState(),
  (builder) =>
    builder
      .addCase(productSettingsActions.managingPanelContent, (state, action) => {
        state.managingPanelContent = action.payload;
      })
      .addCase(
        productSettingsActions.updateOptionGroupList,
        (state, action) => {
          state.optionGroupsList = action.payload;
        }
      )
);
