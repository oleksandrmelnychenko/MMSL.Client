import React from 'react';
import { Stack, ActionButton, Text } from 'office-ui-fabric-react';
import '../dealers/dealers.scss';
import {
  mainTitleContent,
  horizontalGapStackTokens,
  columnIconButtonStyle,
} from '../../common/fabric-styles/styles';

const OrderProfileHeader: React.FC = () => {
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
        <ActionButton
          styles={columnIconButtonStyle}
          iconProps={{ iconName: 'Add' }}
          onClick={() => {
            // dispatch(
            //   controlActions.openRightPanel({
            //     title: 'Add dealer',
            //     width: '600px',
            //     closeFunctions: () => {
            //       dispatch(controlActions.closeRightPanel());
            //     },
            //     component: ManageDealerForm,
            //   })
            // );
          }}
        >
          New order profile
        </ActionButton>
      </Stack>
    </div>
  );
};

export default OrderProfileHeader;
