import React, { useEffect } from 'react';
import { FilterItem } from '../../../interfaces/fabric';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { Stack, Separator } from 'office-ui-fabric-react';
import Filter from './filterItem/Filter';

const FabricFilters: React.FC = () => {
  const filters: FilterItem[] = useSelector<IApplicationState, FilterItem[]>(
    (state) => state.fabricFilters.filters
  );

  return (
    <div>
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
    </div>
  );
};

export default FabricFilters;
