import React from 'react';
import { FilterItem } from '../../../../interfaces/fabric';

export interface IRangeFilterValueProps {
  filterItem: FilterItem;
}

const RangeFilterValue: React.FC<IRangeFilterValueProps> = (
  props: IRangeFilterValueProps
) => {
  return <div>{'Range'}</div>;
};

export default RangeFilterValue;
