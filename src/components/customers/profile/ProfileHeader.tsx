import React from 'react';
import { Stack, Text, Separator } from 'office-ui-fabric-react';
import {
  mainTitleContent,
  horizontalGapStackTokens,
  mainTitleHintContent,
} from '../../../common/fabric-styles/styles';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { StoreCustomer } from '../../../interfaces/storeCustomer';

const ProfileHeader: React.FC = () => {
  const selectedCustomer: StoreCustomer | null | undefined = useSelector<
    IApplicationState,
    StoreCustomer | null | undefined
  >((state) => state.customer.customerState.selectedCustomer);

  return (
    <div>
      <Stack
        horizontal
        verticalAlign="center"
        tokens={horizontalGapStackTokens}
      >
        <Text variant="xLarge" block styles={mainTitleContent}>
          Order profile
        </Text>

        <Separator vertical />

        <Text variant="xLarge" styles={mainTitleHintContent}>
          {selectedCustomer ? selectedCustomer.customerName : ''}
        </Text>
      </Stack>
    </div>
  );
};

export default ProfileHeader;
