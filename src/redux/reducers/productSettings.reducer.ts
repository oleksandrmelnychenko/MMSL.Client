import { OptionGroup, OptionUnit } from './../../interfaces/index';
import { createReducer } from '@reduxjs/toolkit';
import * as productSettingsActions from '../../redux/actions/productSettings.actions';
import { List } from 'linq-typescript';

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

          if (state.optionGroupsList.length === 0) {
            state.managingOptionUnitsState.targetOptionGroup = null;
            state.managingOptionUnitsState.optionUnits = [];
          }

          /// TODO: remove this (Ask Seronya about `get Unit By ID`)
          if (state.managingOptionUnitsState.targetOptionGroup) {
            const optionToReselect = new List(
              state.optionGroupsList
            ).firstOrDefault(
              (item) =>
                item.id === state.managingOptionUnitsState.targetOptionGroup?.id
            );

            if (optionToReselect) {
              state.managingOptionUnitsState.targetOptionGroup = optionToReselect;
              state.managingOptionUnitsState.optionUnits =
                optionToReselect.optionUnits;
            }
          } else {
          }
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
          } else {
            optionUnits = new List<OptionUnit>(optionUnits)
              .orderBy<number>((item) => item.orderIndex)
              .toArray();
          }

          state.managingOptionUnitsState.optionUnits = optionUnits;
        }
      )
);
