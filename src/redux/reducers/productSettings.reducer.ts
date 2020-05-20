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
    this.selectedOptionUnit = null;
    this.isOptionUnitFormVisible = false;
  }

  targetOptionGroup: OptionGroup | null;
  optionUnits: OptionUnit[];
  selectedOptionUnit: OptionUnit | null;
  isOptionUnitFormVisible: boolean;
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
            state.managingOptionUnitsState.selectedOptionUnit = null;
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

              if (state.managingOptionUnitsState.selectedOptionUnit) {
                let unitToSelect = new List<OptionUnit>(
                  state.managingOptionUnitsState.optionUnits
                ).firstOrDefault(
                  (unit) =>
                    unit.id ===
                    state.managingOptionUnitsState.selectedOptionUnit?.id
                );
                if (!unitToSelect) {
                  state.managingOptionUnitsState.selectedOptionUnit = null;
                } else {
                  state.managingOptionUnitsState.selectedOptionUnit = unitToSelect;
                }
              }
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
            state.managingOptionUnitsState.optionUnits = [];
            state.managingOptionUnitsState.selectedOptionUnit = null;
          } else {
            optionUnits = new List<OptionUnit>(optionUnits)
              .orderBy<number>((item) => item.orderIndex)
              .toArray();

            if (
              state.managingOptionUnitsState.selectedOptionUnit &&
              !new List<OptionUnit>(optionUnits).firstOrDefault(
                (unit) =>
                  unit.id ===
                  state.managingOptionUnitsState.selectedOptionUnit?.id
              )
            ) {
              state.managingOptionUnitsState.selectedOptionUnit = null;
            }
          }
        }
      )
      .addCase(
        productSettingsActions.changeTargetOptionunit,
        (state, action) => {
          state.managingOptionUnitsState.selectedOptionUnit = action.payload;
        }
      )
      .addCase(
        productSettingsActions.toggleOptionUnitFormVisibility,
        (state, action) => {
          state.managingOptionUnitsState.isOptionUnitFormVisible =
            action.payload;
        }
      )
);
