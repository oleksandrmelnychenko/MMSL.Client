import { OptionGroup, OptionUnit } from './../../interfaces/index';
import { createReducer } from '@reduxjs/toolkit';
import * as productSettingsActions from '../../redux/actions/productSettings.actions';

export class ProductSettingsState {
  constructor() {
    this.managingPanelContent = null;
    this.optionGroupsList = [];
    this.managingOptionUnitsState = new ManagingOptionUnitsState();
  }

  managingPanelContent: ManagingPanelComponent | null;
  optionGroupsList: OptionGroup[];
  managingOptionUnitsState: ManagingOptionUnitsState;
}

export enum ManagingPanelComponent {
  Unknown,
  ManageGroups,
  ManageUnits,
}

export class ManagingOptionUnitsState {
  constructor() {
    this.targetOptionGroup = null;
    this.optionUnits = [];
  }

  targetOptionGroup: OptionGroup | null;
  optionUnits: OptionUnit[];
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
      .addCase(
        productSettingsActions.changeTargetOptionGroupForUnitsEdit,
        (state, action) => {
          state.managingOptionUnitsState.targetOptionGroup = action.payload;

          let optionUnits =
            state.managingOptionUnitsState.targetOptionGroup?.optionUnits;

          if (optionUnits === null || optionUnits === undefined) {
            optionUnits = [];
          }

          state.managingOptionUnitsState.optionUnits = optionUnits;
        }
      )
);
