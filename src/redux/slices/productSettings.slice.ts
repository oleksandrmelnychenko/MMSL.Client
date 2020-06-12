import { createSlice } from '@reduxjs/toolkit';
import {
  OptionGroup,
  OptionUnit,
  GroupItemVisualState,
} from '../../interfaces/options';
import { List } from 'linq-typescript';

export class ProductSettingsState {
  constructor() {
    this.optionGroupsList = [];
    this.searchWordOptionGroup = '';
    this.managingOptionUnitsState = new ManagingOptionUnitsState();
  }

  optionGroupsList: OptionGroup[];
  editingOptionGroup: OptionGroup | null | undefined;

  searchWordOptionGroup: string;
  managingOptionUnitsState: ManagingOptionUnitsState;

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

export class ManagingOptionUnitsState {
  constructor() {
    this.targetOptionGroup = null;
    this.optionUnits = [];
    this.selectedOptionUnit = null;
    this.isOptionUnitFormVisible = false;
    this.isEditingSingleUnit = false;
  }

  targetOptionGroup: OptionGroup | null;
  optionUnits: OptionUnit[];
  selectedOptionUnit: OptionUnit | null;
  isOptionUnitFormVisible: boolean;
  /// Only when editing concrete single `option unit`
  /// TODO: probably simlify this flow and define another `form component`
  isEditingSingleUnit: boolean;
}

const productSettings = createSlice({
  name: 'productSettings',
  initialState: new ProductSettingsState(),
  reducers: {
    apiGetAllOptionGroupsByProductIdList(
      state,
      action: { type: string; payload: number }
    ) {},
    apiSearchOptionGroupsByProductIdList(
      state,
      action: { type: string; payload: number }
    ) {},
    apiModifyOptionUnitsOrder(state, action) {
      return state;
    },
    apiUpdateOptionUnit(state, action) {
      return state;
    },
    apiCreateNewOptionUnit(state, action) {
      return state;
    },
    apiDeleteOptionUnitById(state, action) {
      return state;
    },
    apiGetOptionUnitById(state, action) {
      return state;
    },
    apiGetOptionGroupById(state, action) {
      return state;
    },
    apiDeleteOptionGroupById(state, action) {
      return state;
    },
    apiUpdateOptionGroup(state, action) {
      return state;
    },
    apiCreateOptionGroup(state, action) {
      return state;
    },
    changeManagingOptionUnitsState(
      state,
      action: { type: string; payload: ManagingOptionUnitsState }
    ) {
      state.managingOptionUnitsState = { ...action.payload };
      return state;
    },
    changeTargetOptionUnit(state, action) {
      state.managingOptionUnitsState.selectedOptionUnit = action.payload;
      return state;
    },
    toggleOptionUnitFormVisibility(state, action) {
      state.managingOptionUnitsState.isOptionUnitFormVisible = action.payload;
      return state;
    },
    updateSearchWordOptionGroup(state, action) {
      state.searchWordOptionGroup = action.payload;
      return state;
    },
    changeEditingGroup(
      state,
      action: { type: string; payload: OptionGroup | null | undefined }
    ) {
      state.editingOptionGroup = action.payload;
      return state;
    },
    updateOptionGroupList(state, action) {
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
      return state;
    },
    changeTargetOptionGroupForUnitsEdit(state, action) {
      state.managingOptionUnitsState.targetOptionGroup = action.payload;
      state.managingOptionUnitsState.isEditingSingleUnit = false;

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
              unit.id === state.managingOptionUnitsState.selectedOptionUnit?.id
          )
        ) {
          state.managingOptionUnitsState.selectedOptionUnit = null;
        }
      }
      return state;
    },
  },
});

export const productSettingsActions = productSettings.actions;
export default productSettings.reducer;
