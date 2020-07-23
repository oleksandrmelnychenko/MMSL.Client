import React, { useEffect } from 'react';
import { FilterItem } from '../../../interfaces/fabric';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { Stack, Separator, SearchBox } from 'office-ui-fabric-react';
import Filter from './filterItem/Filter';
import { assignPendingActions } from '../../../helpers/action.helper';
import { fabricActions } from '../../../redux/slices/store/fabric/fabric.slice';

const FabricFilters: React.FC = () => {
  const dispatch = useDispatch();

  const filters: FilterItem[] = useSelector<IApplicationState, FilterItem[]>(
    (state) => state.fabricFilters.filters
  );

  const searchWord: string = useSelector<IApplicationState, string>(
    (state) => state.fabric.searchWord
  );

  return (
    <div>
      <Stack tokens={{ childrenGap: '18px' }}>
        <SearchBox
          // styles={searchBoxStyles}
          value={searchWord}
          placeholder="Find fabric"
          onSearch={(args: any) => {
            dispatch(fabricActions.changeSearchWord(args ? args : ''));

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
          onChange={(args: any) => {}}
        />

        <Stack>
          {filters.map((item: FilterItem, index: number) => {
            return (
              <Stack.Item key={index}>
                <Filter filterItem={item} />
                <Separator
                  styles={{ root: { paddingTop: '0px', paddingBottom: '0px' } }}
                />
              </Stack.Item>
            );
          })}
        </Stack>
      </Stack>
    </div>
  );
};

export default FabricFilters;
