import { UserIdentity } from './identity';
import { EntityBase } from './base';
import { List } from 'linq-typescript';

export enum FabricStatuses {
  InStock = 0,
  OutOfStock = 1,
  Discontinued = 2,
}

export class Fabric extends EntityBase {
  constructor() {
    super();

    this.fabricCode = '';
    this.description = '';
    this.imageUrl = '';

    this.status = FabricStatuses.InStock;

    this.metres = '';
    this.mill = '';
    this.color = '';
    this.composition = '';
    this.gsm = '';
    this.count = 0;
    this.weave = '';
    this.pattern = '';

    this.isMetresVisible = false;
    this.isMillVisible = false;
    this.isColorVisible = false;
    this.isCompositionVisible = false;
    this.isGSMVisible = false;
    this.isCountVisible = false;
    this.isWeaveVisible = false;
    this.isPatternVisible = false;

    this.userIdentityId = 0;
    this.userIdentity = null;
  }

  fabricCode: string;
  description: string;
  imageUrl: string;

  status: FabricStatuses;

  metres: string;
  mill: string;
  color: string;
  composition: string;
  gsm: string;
  count: number;
  weave: string;
  pattern: string;

  isMetresVisible: boolean;
  isMillVisible: boolean;
  isColorVisible: boolean;
  isCompositionVisible: boolean;
  isGSMVisible: boolean;
  isCountVisible: boolean;
  isWeaveVisible: boolean;
  isPatternVisible: boolean;

  userIdentityId: number;
  userIdentity: UserIdentity | null | undefined;
}

export class FabricVisibilities {
  constructor() {
    this.isMetresVisible = false;
    this.isMillVisible = false;
    this.isColorVisible = false;
    this.isCompositionVisible = false;
    this.isGSMVisible = false;
    this.isCountVisible = false;
    this.isWeaveVisible = false;
    this.isPatternVisible = false;
  }

  isMetresVisible: boolean;
  isMillVisible: boolean;
  isColorVisible: boolean;
  isCompositionVisible: boolean;
  isGSMVisible: boolean;
  isCountVisible: boolean;
  isWeaveVisible: boolean;
  isPatternVisible: boolean;
}

export class FabricFilterValue {
  constructor() {
    this.value = '';
    this.applied = false;
  }

  value: string;
  applied: boolean;
}

export class FilterItem {
  constructor() {
    this.name = '';

    this.min = 0;
    this.max = 0;

    this.isRange = false;

    this.values = [];

    this.isExpanded = false;
    this.isApplied = false;
  }

  name: string;
  min: number;
  max: number;

  isRange: boolean;

  values: FabricFilterValue[];

  isExpanded: boolean;
  isApplied: boolean;
}

export const isAnyApplied: (filterItems: FilterItem[]) => boolean = (
  filterItems: FilterItem[]
) => {
  let isApplied: boolean = false;

  filterItems.forEach((filter: FilterItem) => {
    if (filter.isApplied) {
      isApplied = true;
      return isApplied;
    }
  });

  return isApplied;
};

export const getApplied: (filterItems: FilterItem[]) => FilterItem[] = (
  filterItems: FilterItem[]
) => {
  let result: FilterItem[] = new List<FilterItem>(filterItems)
    .select((filterItem: FilterItem) => {
      let selectResult: any = null;

      if (filterItem.isRange) {
        if (filterItem.isApplied) {
          selectResult = { ...filterItem };
        }
      } else {
        let appliedValues = new List(filterItem.values)
          .where((value: FabricFilterValue) => value.applied)
          .toArray();

        if (appliedValues.length > 0) {
          selectResult = { ...filterItem, values: appliedValues };
        }
      }

      return selectResult;
    })
    .where((item: any) => item !== null)
    .toArray();

  return result;
};

// export const getApplied: (filterItems: FilterItem[]) => FilterItem[] = (
//   filterItems: FilterItem[]
// ) => {
//   let result: FilterItem[] = new List<FilterItem>(filterItems)
//     .select((filterItem: FilterItem) => {
//       let selectResult: any = null;

//       if (filterItem.isRange) {
//         selectResult = { ...filterItem };
//       } else {
//         let appliedValues = new List(filterItem.values)
//           .where((value: FabricFilterValue) => value.applied)
//           .toArray();

//         if (appliedValues.length > 0) {
//           selectResult = { ...filterItem, values: appliedValues };
//         }
//       }

//       return selectResult;
//     })
//     .where((item: any) => item !== null)
//     .toArray();

//   return result;
// };

export const syncFilters: (
  filterItems: FilterItem[],
  sourceFilterItems: FilterItem[]
) => void = (filterItems: FilterItem[], sourceFilterItems: FilterItem[]) => {
  const sourceList = new List(sourceFilterItems);

  filterItems.forEach((filterItem: FilterItem) => {
    const sourceTargetFilter = sourceList.firstOrDefault(
      (sourceItem: FilterItem) => sourceItem.name === filterItem.name
    );

    if (sourceTargetFilter) {
      filterItem.isExpanded = sourceTargetFilter.isExpanded;

      syncFilterValues(filterItem.values, sourceTargetFilter.values);
    }
  });
};

export const syncFilterValues: (
  values: FabricFilterValue[],
  sourceValues: FabricFilterValue[]
) => void = (
  values: FabricFilterValue[],
  sourceValues: FabricFilterValue[]
) => {
  const sourceList = new List(sourceValues);

  values.forEach((valueItem: FabricFilterValue) => {
    const sourceTargetValue = sourceList.firstOrDefault(
      (sourceValue: FabricFilterValue) => sourceValue.value === valueItem.value
    );

    if (sourceTargetValue) {
      valueItem.applied = sourceTargetValue.applied;
    }
  });
};
