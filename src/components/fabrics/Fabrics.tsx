import React from 'react';
import { Stack } from 'office-ui-fabric-react';
import FabricsHeader from './FabricsHeader';
import FabricList from './FabricList';

const Fabrics: React.FC = () => {
  return (
    <div className="content__root">
      <Stack verticalAlign="space-around">
        <Stack.Item align="stretch">
          <div className="content__header">
            <div className="content__header__top">
              <FabricsHeader />
            </div>
          </div>
        </Stack.Item>
        <Stack.Item>
          <FabricList />
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default Fabrics;
