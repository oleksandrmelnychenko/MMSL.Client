import React from 'react';
import { FilterItem, FabricFilterValue } from '../../../../interfaces/fabric';
import { Stack, Label } from 'office-ui-fabric-react';
import FilterValue from './valuable/FilterValue';
import RangeFilterValue from './range/RangeFilterValue';
import FilterHeader from './FilterHeader';

const _renderHintLable = (textMessage: string): JSX.Element => {
  const result = (
    <Label
      styles={{
        root: {
          fontWeight: 400,
          fontSize: '12px',
          color: '#a19f9d',
        },
      }}
    >
      {textMessage}
    </Label>
  );

  return result;
};

const _renderFilterContent = (filterItem: FilterItem) => {
  let result = null;

  if (filterItem.isRange) {
    result = (
      <div style={{ marginTop: '9px' }}>
        <RangeFilterValue filterItem={filterItem} />
      </div>
    );
  } else {
    if (filterItem.isExpanded) {
      if (filterItem.values.length > 0) {
        result = (
          <Stack>
            {filterItem.values.map(
              (value: FabricFilterValue, index: number) => {
                return (
                  <Stack.Item key={index}>
                    <FilterValue
                      filterName={filterItem.name}
                      fabricFilterValue={value}
                    />
                  </Stack.Item>
                );
              }
            )}
          </Stack>
        );
      } else {
        result = _renderHintLable('No available filter options');
      }
    }
  }

  return result;
};

export interface IFilterProps {
  filterItem: FilterItem;
}

const Filter: React.FC<IFilterProps> = (props: IFilterProps) => {
  return (
    <div className="filter">
      <Stack tokens={{ childrenGap: '6px' }}>
        <FilterHeader filterItem={props.filterItem} />
      </Stack>

      <div className="filter">
        <Stack tokens={{ childrenGap: '6px' }}>
          {_renderFilterContent(props.filterItem)}
        </Stack>
      </div>
    </div>
  );
};

export default Filter;
