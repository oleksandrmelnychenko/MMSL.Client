import {
  FilterItem,
  FabricFilterValue,
  syncFilters,
} from '../../../../interfaces/fabric';
import { createSlice } from '@reduxjs/toolkit';
import { List } from 'linq-typescript';

const INIT_STATE: IfabricFiltersState = {
  filters: [],
};

export interface IfabricFiltersState {
  filters: FilterItem[];
}

const fabricFilters = createSlice({
  name: 'fabricFilters',
  initialState: INIT_STATE,

  reducers: {
    apiGetFilters(state) {},
    changeFilters(state, action: { type: string; payload: FilterItem[] }) {
      state.filters = action.payload;
      return state;
    },
    changeAndApplyFilters(
      state,
      action: { type: string; payload: FilterItem[] }
    ) {
      syncFilters(action.payload, state.filters);

      state.filters = action.payload;

      return state;
    },
    onFilterExpand(state, action: { type: string; payload: FilterItem }) {
      const updatedFilters = new List(state.filters)
        .select((filterItem: FilterItem) => {
          let selectResult = filterItem;

          if (action.payload.name === filterItem.name) {
            selectResult = action.payload;
          }

          return selectResult;
        })
        .toArray();

      state.filters = updatedFilters;

      return state;
    },
    onCheckValueFilter(
      state,
      action: {
        type: string;
        payload: {
          filterName: string;
          fabricFilterValue: FabricFilterValue;
        };
      }
    ) {
      let updatedFilters = new List(state.filters)
        .select((filterItem: FilterItem) => {
          let selectResult = filterItem;

          if (action.payload.filterName === filterItem.name) {
            const valuesList = new List(selectResult.values).select(
              (valueItem: FabricFilterValue) => {
                let valueSelectResult = valueItem;

                if (
                  valueItem.value === action.payload.fabricFilterValue.value
                ) {
                  valueSelectResult = action.payload.fabricFilterValue;
                }

                return valueSelectResult;
              }
            );

            selectResult.values = valuesList.toArray();
            selectResult.isApplied = valuesList.any(
              (valueItem: FabricFilterValue) => valueItem.applied
            );
          }

          return selectResult;
        })
        .toArray();

      state.filters = updatedFilters;

      return state;
    },
    onResetSingleValueFilter(
      state,
      action: {
        type: string;
        payload: FilterItem;
      }
    ) {
      let updatedFilters = new List(state.filters)
        .select((filterItem: FilterItem) => {
          let selectResult = filterItem;

          if (action.payload.name === filterItem.name) {
            selectResult.values.forEach((valueItem: FabricFilterValue) => {
              valueItem.applied = false;
            });
            selectResult.isApplied = false;
          }

          return selectResult;
        })
        .toArray();

      state.filters = updatedFilters;

      return state;
    },
    onApplyRangeFilter(
      state,
      action: {
        type: string;
        payload: {
          rangefilterItem: FilterItem;
        };
      }
    ) {
      if (action.payload.rangefilterItem.isRange) {
        let updatedFilters = new List(state.filters)
          .select((filterItem: FilterItem) => {
            let selectResult = filterItem;

            if (action.payload.rangefilterItem.name === filterItem.name) {
              selectResult = {
                ...selectResult,
                min: action.payload.rangefilterItem.min,
                max: action.payload.rangefilterItem.max,
                isApplied: true,
              };
            }

            return selectResult;
          })
          .toArray();

        state.filters = updatedFilters;
      }

      return state;
    },
  },
});

export const fabricFiltersActions = fabricFilters.actions;
export default fabricFilters.reducer;
