import React from 'react';
import { IApplicationState } from '../../redux/reducers';
import { useSelector } from 'react-redux';
import { Fabric } from '../../interfaces/fabric';
import { ScrollablePane, Stack } from 'office-ui-fabric-react';
import * as fabricStyles from '../../common/fabric-styles/styles';
import FabricItem from './fabricItem/FabricItem';

const FabricList: React.FC = () => {
  const fabrics: Fabric[] = useSelector<IApplicationState, Fabric[]>(
    (state) => state.fabric.fabrics
  );

  return (
    <>
      <ScrollablePane
        styles={{
          ...fabricStyles.scrollablePaneStyleForDetailList,
          contentContainer: { overflowX: 'hidden', padding: '12px' },
        }}
      >
        <Stack horizontal tokens={{ childrenGap: '24px' }} wrap>
          {fabrics.map((fabric: Fabric, index: number) => {
            return <FabricItem fabric={fabric} key={index} />;
          })}
        </Stack>
      </ScrollablePane>
    </>
  );
};

export default FabricList;
