import React from 'react';
import { ActionButton, Text, Stack, SearchBox } from 'office-ui-fabric-react';
import { useDispatch } from 'react-redux';
import {
  horizontalGapStackTokens,
  mainTitleContent,
} from '../../common/fabric-styles/styles';
import { isUserCanManageFabrics } from '../../helpers/fabric.helper';
import { fabricActions } from '../../redux/slices/store/fabric/fabric.slice';
import { controlActions } from '../../redux/slices/control.slice';
import FabricForm from './managing/FabricForm';

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
        <ActionButton
          onClick={() => {
            dispatch(fabricActions.changeTargetFabric(null));
            dispatch(
              controlActions.openRightPanel({
                title: 'New Fabric',
                width: '900px',
                closeFunctions: () => {
                  dispatch(controlActions.closeRightPanel());
                },
                component: FabricForm,
              })
            );
          }}
          iconProps={{ iconName: 'Add' }}
        >
          New fabric
        </ActionButton>
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
