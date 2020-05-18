import { createReducer } from '@reduxjs/toolkit';
import * as productSettingsActions from '../../redux/actions/productSettings.actions';

export class ProductSettingsState {
  constructor() {
    this.managingPanelContent = null;
  }

  managingPanelContent: ManagingPanelComponent | null;
}

export enum ManagingPanelComponent {
  Unknown,
  ManageGroups,
  ManageUnits,
}

export const productSettingsReducer = createReducer(
  new ProductSettingsState(),
  (builder) =>
    builder.addCase(
      productSettingsActions.managingPanelContent,
      (state, action) => {
        state.managingPanelContent = action.payload;
      }
    )
);
