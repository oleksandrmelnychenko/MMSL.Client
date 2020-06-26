import React from 'react';
import { Stack } from 'office-ui-fabric-react';
import '../dealers/dealers.scss';

const OrderProfileView: React.FC = () => {
  return (
    <div className="content__root">
      <Stack verticalAlign="space-around">
        <Stack.Item align="stretch">
          <div className="content__header">
            <div className="content__header__top">{'Order p header'}</div>
          </div>
        </Stack.Item>
        <Stack.Item>{'Order profile main content'}</Stack.Item>
      </Stack>
    </div>
  );
};

export default OrderProfileView;
