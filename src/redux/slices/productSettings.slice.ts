import { createSlice } from '@reduxjs/toolkit';
import {
  OptionGroup,
  OptionUnit,
  GroupItemVisualState,
} from '../../interfaces/options';
import { DeliveryTimeline } from '../../interfaces/deliveryTimelines';
import { List } from 'linq-typescript';

export class ProductSettingsState {
  constructor() {
    this.optionGroupsList = [];
    this.searchWordOptionGroup = '';
    this.managingOptionUnitsState = new ManagingOptionUnitsState();
    this.manageTimelineState = new ManageTimelineState();
  }

  optionGroupsList: OptionGroup[];
  editingOptionGroup: OptionGroup | null | undefined;

  searchWordOptionGroup: string;
  managingOptionUnitsState: ManagingOptionUnitsState;
  manageTimelineState: ManageTimelineState;

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

export class ManageTimelineState {
  constructor() {
    this.deliveryTimelines = [];
    this.selectedDeliveryTimeline = null;
  }
  deliveryTimelines: DeliveryTimeline[];
  selectedDeliveryTimeline: DeliveryTimeline | null;
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
    apiGetAllDeliveryTimeline(state) {
      return state;
    },
    successGetAllDeliveryTimelines(
      state,
      action: { type: string; payload: DeliveryTimeline[] }
    ) {
      state.manageTimelineState.deliveryTimelines = action.payload;
      return state;
    },
    clearAllDeliveryTimelines(state) {
      state.manageTimelineState.deliveryTimelines = [];
      return state;
    },
    apiCreateNewDeliveryTimeline(
      state,
      action: { type: string; payload: DeliveryTimeline }
    ) {
      return state;
    },
    selectedDeliveryTimeLine(state, action: { type: string; payload: number }) {
      state.manageTimelineState.selectedDeliveryTimeline = new List<
        DeliveryTimeline
      >(state.manageTimelineState.deliveryTimelines).first(
        (timeline) => timeline.id === action.payload
      );
      return state;
    },
    clearSelectedDeliveryTimeLine(state) {
      state.manageTimelineState.selectedDeliveryTimeline = null;
      return state;
    },
    apiUpdateDeliveryTimeline(
      state,
      action: { type: string; payload: DeliveryTimeline }
    ) {
      return state;
    },
    apiDeleteDeliveryTimeline(
      state,
      action: { type: string; payload: number }
    ) {
      return state;
    },
    changeManagingOptionUnitsState(
      state,
      action: { type: string; payload: ManagingOptionUnitsState }
    ) {
      state.managingOptionUnitsState = { ...action.payload };
      return state;
    },
    changeTargetOptionunit(state, action) {
      state.managingOptionUnitsState.selectedOptionUnit = action.payload;
      return state;
    },
    apiSaveNewOptionGroup(state, action) {
      return state;
    },
    apiGetAllOptionGroupsByProductIdList(
      state,
      action: { type: string; payload: number }
    ) {},
    apiSearchOptionGroupsByProductIdList(
      state,
      action: { type: string; payload: number }
    ) {},
    modifyOptionUnitsOrder(state, action) {
      return state;
    },
    apiUpdateOptionUnit(state, action) {
      return state;
    },
    apiCreateNewOptionUnit(state, action) {
      return state;
    },
    deleteOptionUnitById(state, action) {
      return state;
    },
    apiGetOptionGroupById(state, action) {
      return state;
    },
    apiGetOptionUnitById(state, action) {
      return state;
    },
    deleteOptionGroupById(state, action) {
      return state;
    },
    getAndSelectOptionGroupForSingleEditById(state, action) {
      return state;
    },
    apiSaveEditOptionGroup(state, action) {
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
  },
});

export const productSettingsActions = productSettings.actions;
export default productSettings.reducer;
