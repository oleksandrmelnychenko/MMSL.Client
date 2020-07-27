import React from 'react';
import { FilterItem } from '../../../../interfaces/fabric';
import {
  Stack,
  IconButton,
  Text,
  FontWeights,
  ActionButton,
} from 'office-ui-fabric-react';
import { useDispatch } from 'react-redux';
import { fabricFiltersActions } from '../../../../redux/slices/store/fabric/fabricFilters.slice';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { fabricActions } from '../../../../redux/slices/store/fabric/fabric.slice';

export interface FilterHeaderProps {
  filterItem: FilterItem;
}

const FilterHeader: React.FC<FilterHeaderProps> = (
  props: FilterHeaderProps
) => {
  const dispatch = useDispatch();

  return (
    <div>
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

        {props.filterItem.isApplied ? (
          <ActionButton
            styles={{ root: { height: '32px' } }}
            disabled={!props.filterItem.isApplied}
            iconProps={{
              iconName: 'Refresh',
              styles: { root: { fontSize: '14px' } },
            }}
            onClick={() => {
              dispatch(
                fabricFiltersActions.onResetSingleValueFilter(props.filterItem)
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
        ) : null}

        {props.filterItem.isRange ? null : (
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
        )}
      </Stack>
    </div>
  );
};

export default FilterHeader;
