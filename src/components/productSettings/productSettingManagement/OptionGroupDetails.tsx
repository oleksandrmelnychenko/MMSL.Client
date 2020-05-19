import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as productSettingsActions from '../../../redux/actions/productSettings.actions';
import OptionItemsOrderingList from './OptionItemsOrderingList';
import {
  Stack,
  FocusZoneDirection,
  FocusZone,
  Separator,
} from 'office-ui-fabric-react';

export const OptionGroupDetails: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productSettingsActions.getAllOptionGroupsList());
  }, [dispatch]);

  return (
    <div className="customerList">
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}
      >
        <Stack.Item grow={1} styles={{ root: { maxWidth: '49%' } }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Option units</Separator>
              <OptionItemsOrderingList />
            </div>
          </FocusZone>
        </Stack.Item>
        <Stack.Item grow={1}></Stack.Item>
      </Stack>
    </div>
  );
};

export default OptionGroupDetails;
