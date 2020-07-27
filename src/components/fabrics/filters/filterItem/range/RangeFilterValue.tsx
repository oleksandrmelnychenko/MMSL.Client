import React, { useState, useEffect } from 'react';
import { FilterItem } from '../../../../../interfaces/fabric';
import { Stack, IconButton } from 'office-ui-fabric-react';
import RangeEntry from './RangeEntry';
import { useDispatch } from 'react-redux';
import { fabricFiltersActions } from '../../../../../redux/slices/store/fabric/fabricFilters.slice';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { fabricActions } from '../../../../../redux/slices/store/fabric/fabric.slice';

export interface IRangeFilterValueProps {
  filterItem: FilterItem;
}

const RangeFilterValue: React.FC<IRangeFilterValueProps> = (
  props: IRangeFilterValueProps
) => {
  const dispatch = useDispatch();

  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);

  useEffect(() => {
    setMinValue(props.filterItem.min);
    setMaxValue(props.filterItem.max);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Stack horizontal>
        <Stack horizontal grow={1} tokens={{ childrenGap: '12px' }}>
          <RangeEntry
            filterItem={props.filterItem}
            value={minValue}
            isMin={true}
            onValueChanged={(value: number) => {
              if (value <= maxValue && value >= 0) setMinValue(value);
            }}
          />
          <RangeEntry
            filterItem={props.filterItem}
            value={maxValue}
            isMin={false}
            onValueChanged={(value: number) => {
              if (value >= minValue && value >= 0) setMaxValue(value);
            }}
          />
        </Stack>
        <IconButton
          iconProps={{
            iconName: 'FilterSolid',
          }}
          onClick={() => {
            dispatch(
              fabricFiltersActions.onApplyRangeFilter({
                rangefilterItem: {
                  ...props.filterItem,
                  min: minValue,
                  max: maxValue,
                },
              })
            );

            dispatch(
              assignPendingActions(
                fabricActions.apiGetAllFabricsPaginated(),
                [],
                [],
                (args: any) => {
                  dispatch(fabricActions.changeFabrics(args.entities));
                  dispatch(
                    fabricActions.changePaginationInfo(args.paginationInfo)
                  );
                },
                (args: any) => {}
              )
            );
          }}
        />
      </Stack>
    </div>
  );
};

export default RangeFilterValue;
