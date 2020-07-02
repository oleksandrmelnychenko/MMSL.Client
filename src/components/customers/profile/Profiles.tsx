import React from 'react';
import { Stack } from 'office-ui-fabric-react';

export const Profiles: React.FC = (props: any) => {
  return (
    <div className="content__root">
      <Stack verticalAlign="space-around">
        <Stack.Item align="stretch">
          <div className="content__header">
            <div className="content__header__top">{'Header'}</div>
          </div>
        </Stack.Item>
        <Stack.Item>{'Profiles'}</Stack.Item>
      </Stack>
    </div>
  );
};

export default Profiles;
