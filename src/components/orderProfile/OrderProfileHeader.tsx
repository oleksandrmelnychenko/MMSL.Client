import React from 'react';
import { Stack, ActionButton, Text } from 'office-ui-fabric-react';
import '../dealers/dealers.scss';
import {
  mainTitleContent,
  horizontalGapStackTokens,
  columnIconButtonStyle,
} from '../../common/fabric-styles/styles';
import { useDispatch } from 'react-redux';
import { controlActions } from '../../redux/slices/control.slice';
import OrderProfileFormBootstrapper from './managing/orderProfile/OrderProfileFormBootstrapper';
import { orderProfileActions } from '../../redux/slices/customer/orderProfile/orderProfile.slice';

const OrderProfileHeader: React.FC = () => {
  const dispatch = useDispatch();

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
            dispatch(orderProfileActions.changeTargetOrderProfile(null));
            dispatch(
              controlActions.openRightPanel({
                title: 'New Order profile',
                width: '700px',
                closeFunctions: () => {
                  dispatch(controlActions.closeRightPanel());
                },
                component: OrderProfileFormBootstrapper,
              })
            );
          }}
        >
          New order profile
        </ActionButton>
      </Stack>
    </div>
  );
};

export default OrderProfileHeader;
