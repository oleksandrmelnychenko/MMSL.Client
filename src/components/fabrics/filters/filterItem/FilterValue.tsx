import React from 'react';
import { FabricFilterValue } from '../../../../interfaces/fabric';
import { Checkbox, Stack, Text, FontWeights } from 'office-ui-fabric-react';
import './filterValue.scss';
import { useDispatch } from 'react-redux';
import { fabricFiltersActions } from '../../../../redux/slices/store/fabric/fabricFilters.slice';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { fabricActions } from '../../../../redux/slices/store/fabric/fabric.slice';

export interface IFilterValueProps {
  filterName: string;
  fabricFilterValue: FabricFilterValue;
}
const FilterValue: React.FC<IFilterValueProps> = (props: IFilterValueProps) => {
  const dispatch = useDispatch();

  return (
    <div className={'filterValue'}>
      <Stack horizontal tokens={{ childrenGap: '6px' }}>
        <Checkbox
          checked={props.fabricFilterValue.applied}
          onChange={(checked: any, isChecked: any) => {
            dispatch(
              fabricFiltersActions.onCheckValueFilter({
                filterName: props.filterName,
                fabricFilterValue: {
                  ...props.fabricFilterValue,
                  applied: !props.fabricFilterValue.applied,
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
        <Text
          block
          nowrap
          styles={{
            root: {
              // marginTop: '5px',
              fontSize: '14px',
              fontWeight: FontWeights.regular,
            },
          }}
        >
          {props.fabricFilterValue.value}
        </Text>
      </Stack>
    </div>
  );
};

export default FilterValue;
