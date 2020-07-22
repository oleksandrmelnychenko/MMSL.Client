import React from 'react';
import { ActionButton, Text, Stack, SearchBox } from 'office-ui-fabric-react';
import { useDispatch } from 'react-redux';
import {
  horizontalGapStackTokens,
  mainTitleContent,
} from '../../common/fabric-styles/styles';
import { isUserCanManageFabrics } from '../../helpers/fabric.helper';
import { fabricActions } from '../../redux/slices/store/fabric/fabric.slice';
import {
  rightPanelActions,
  RightPanelType,
} from '../../redux/slices/rightPanel.slice';
import FabricForm from './managing/entity/FabricForm';
import FabricPropsVisibilityForm from './managing/propsVisibility/FabricPropsVisibilityForm';

export const FabricsHeader: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const searchBoxStyles = { root: { width: 200 } };

  const canManageFabrics: boolean = isUserCanManageFabrics();

  return (
    <Stack horizontal verticalAlign="center" tokens={horizontalGapStackTokens}>
      <Text variant="xLarge" block styles={mainTitleContent}>
        Fabric
      </Text>

      {canManageFabrics ? (
        <Stack horizontal>
          <ActionButton
            onClick={() => {
              dispatch(fabricActions.changeTargetFabric(null));
              dispatch(
                rightPanelActions.openRightPanel({
                  title: 'New Fabric',
                  width: '900px',
                  panelType: RightPanelType.Form,
                  closeFunctions: () => {
                    dispatch(rightPanelActions.closeRightPanel());
                  },
                  component: FabricForm,
                })
              );
            }}
            iconProps={{ iconName: 'Add' }}
          >
            New fabric
          </ActionButton>

          <ActionButton
            onClick={() => {
              dispatch(fabricActions.changeTargetFabric(null));
              dispatch(
                rightPanelActions.openRightPanel({
                  title: 'Configure avaiability',
                  description:
                    'Configure availability of the fabric parts that will be visible for your dealers.',
                  width: '400px',
                  panelType: RightPanelType.Form,
                  closeFunctions: () => {
                    dispatch(rightPanelActions.closeRightPanel());
                  },
                  component: FabricPropsVisibilityForm,
                })
              );
            }}
            iconProps={{ iconName: 'Settings' }}
          >
            Configure avaiability
          </ActionButton>
        </Stack>
      ) : null}

      <SearchBox
        styles={searchBoxStyles}
        placeholder="Find fabric"
        onSearch={(args: any) => {
          //   if (args) {
          //     let value = args.target.value;
          //     dispatch(customerActions.searchCustomer(value));
          //     dispatch(customerActions.getCustomersListPaginated());
          //   } else {
          //     dispatch(customerActions.searchCustomer(''));
          //     dispatch(customerActions.getCustomersListPaginated());
          //   }
        }}
        onChange={(args: any) => {
          //   if (args) {
          //     let value = args.target.value;
          //     dispatch(customerActions.searchCustomer(value));
          //     dispatch(customerActions.getCustomersListPaginated());
          //   } else {
          //     dispatch(customerActions.searchCustomer(''));
          //     dispatch(customerActions.getCustomersListPaginated());
          //   }
        }}
      />
    </Stack>
  );
};

export default FabricsHeader;
