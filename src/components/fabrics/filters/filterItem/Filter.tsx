import React from 'react';
import { FilterItem, FabricFilterValue } from '../../../../interfaces/fabric';
import {
  Stack,
  IconButton,
  Text,
  FontWeights,
  Label,
} from 'office-ui-fabric-react';
import FilterValue from './FilterValue';
import RangeFilterValue from './RangeFilterValue';
import './filter.scss';
import { useDispatch } from 'react-redux';
import { fabricFiltersActions } from '../../../../redux/slices/store/fabric/fabricFilters.slice';

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

export interface IFilterProps {
  filterItem: FilterItem;
}

const Filter: React.FC<IFilterProps> = (props: IFilterProps) => {
  const dispatch = useDispatch();

  return (
    <div className="filter">
      <Stack tokens={{ childrenGap: '6px' }}>
        <Stack horizontal>
          <Stack.Item grow={1}>
            <Text
              block
              nowrap
              styles={{
                root: {
                  marginTop: '5px',
                  fontSize: '15px',
                  fontWeight: FontWeights.semibold,
                },
              }}
            >
              {props.filterItem.name}
            </Text>
          </Stack.Item>

          <IconButton
            iconProps={{
              iconName: props.filterItem.isExpanded
                ? 'ChevronDownMed'
                : 'ChevronRightMed',
            }}
            onClick={() => {
              dispatch(
                fabricFiltersActions.onFilterExpand({
                  ...props.filterItem,
                  isExpanded: !props.filterItem.isExpanded,
                })
              );
            }}
          />
        </Stack>

        {props.filterItem.isExpanded ? (
          props.filterItem.isRange ? (
            <RangeFilterValue filterItem={props.filterItem} />
          ) : props.filterItem.values.length > 0 ? (
            <Stack>
              {props.filterItem.values.map(
                (value: FabricFilterValue, index: number) => {
                  return (
                    <Stack.Item key={index}>
                      <FilterValue
                        filterName={props.filterItem.name}
                        fabricFilterValue={value}
                      />
                    </Stack.Item>
                  );
                }
              )}
            </Stack>
          ) : (
            _renderHintLable('No available filter options')
          )
        ) : null}
      </Stack>
    </div>
  );
};

export default Filter;
