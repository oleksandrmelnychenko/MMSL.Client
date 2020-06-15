import React from 'react';
import './dealers.scss';
import { Stack } from 'office-ui-fabric-react';
import DealerList from './DealerList';
import DealerPanel from './DealerPanel';
import DealersHeader from './DealersHeader';

export const Dealers: React.FC = (props: any) => {
  return (
    <div className="content__root">
      <Stack verticalAlign="space-around">
        <Stack.Item align="stretch">
          <div className="content__header">
            <div className="content__header__top">
              <DealersHeader />
            </div>
          </div>
        </Stack.Item>
        <Stack.Item>
          <DealerList />
        </Stack.Item>
      </Stack>

      <DealerPanel />
    </div>
  );
};

export default Dealers;
