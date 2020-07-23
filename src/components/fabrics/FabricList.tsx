import React from 'react';
import { IApplicationState } from '../../redux/reducers';
import { useSelector } from 'react-redux';
import { Fabric, FilterItem, isAnyApplied } from '../../interfaces/fabric';
import FabricItem from './fabricItem/FabricItem';
import { Stack, Label } from 'office-ui-fabric-react';

const _renderHintLable = (textMessage: string): JSX.Element => {
  const result = (
    <Label
      styles={{
        root: {
          fontWeight: 400,
          fontSize: '16px',
          color: '#a19f9d',
        },
      }}
    >
      {textMessage}
    </Label>
  );

  return result;
};

const FabricList: React.FC = () => {
  const fabrics: Fabric[] = useSelector<IApplicationState, Fabric[]>(
    (state) => state.fabric.fabrics
  );

  const filters: FilterItem[] = useSelector<IApplicationState, FilterItem[]>(
    (state) => state.fabricFilters.filters
  );

  const isSearching: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.fabric.searchWord.length > 0
  );

  const isFiltered: boolean = isAnyApplied(filters) || isSearching;

  return (
    <div>
      {isFiltered && fabrics.length === 0 ? (
        _renderHintLable('No such fabrics')
      ) : (
        <Stack horizontal tokens={{ childrenGap: '24px' }} wrap>
          {fabrics.map((fabric: Fabric, index: number) => {
            return <FabricItem fabric={fabric} key={index} />;
          })}
        </Stack>
      )}
    </div>
  );
};

export default FabricList;
