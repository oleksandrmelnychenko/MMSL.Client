import { OptionGroup, OptionUnit } from './../../interfaces/index';
import { createReducer } from '@reduxjs/toolkit';
import * as productSettingsActions from '../../redux/actions/productSettings.actions';
import { List } from 'linq-typescript';
import { GroupItemVisualState } from '../../interfaces/viewModels';

export class ProductSettingsState {
  constructor() {
    this.managingPanelContent = null;
    this.optionGroupsList = [];
    this.searchWordOptionGroup = '';
    this.managingOptionUnitsState = new ManagingOptionUnitsState();
    this.manageSingleOptionUnitState = new ManageSingleOptionUnitState();
    this.manageSingleOptionGroupState = new ManageSingleOptionGroupState();
  }

  managingPanelContent: ManagingPanelComponent | null;
  optionGroupsList: OptionGroup[];
  searchWordOptionGroup: string;
  managingOptionUnitsState: ManagingOptionUnitsState;
  manageSingleOptionUnitState: ManageSingleOptionUnitState;
  manageSingleOptionGroupState: ManageSingleOptionGroupState;

  setOptionGroupsList: (source: OptionGroup[]) => void = (
    source: OptionGroup[]
  ) => {
    this.optionGroupsList = new List(source)
      .select((item) => {
        item.groupItemVisualState = new GroupItemVisualState();

        const relatedGroup = new List(this.optionGroupsList).firstOrDefault(
          (relatedItem) => relatedItem.id === item.id
        );

        item.groupItemVisualState.isCollapsed = relatedGroup
          ?.groupItemVisualState?.isCollapsed
          ? relatedGroup.groupItemVisualState.isCollapsed
          : false;

        return item;
      })
      .toArray();
  };
}

export enum ManagingPanelComponent {
  Unknown,
  ManageGroups,
  ManageUnits,
  ManageSingleOptionUnit,
  ManageSingleOptionGroup,
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

export class ManageSingleOptionUnitState {
  constructor() {
    this.optionUnit = null;
  }

  optionUnit: OptionUnit | null | undefined;
}

export class ManageSingleOptionGroupState {
  constructor() {
    this.optionGroup = null;
  }

  optionGroup: OptionGroup | null | undefined;
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
          state.setOptionGroupsList(action.payload);

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
      .addCase(
        productSettingsActions.updateSearchWordOptionGroup,
        (state, action) => {
          state.searchWordOptionGroup = action.payload;
        }
      )
      .addCase(
        productSettingsActions.updateSingleEditOptionUnit,
        (state, action) => {
          state.manageSingleOptionUnitState.optionUnit = action.payload;
        }
      )
      .addCase(
        productSettingsActions.updateTargetSingleEditOptionGroup,
        (state, action) => {
          state.manageSingleOptionGroupState.optionGroup = action.payload;
        }
      )
);
