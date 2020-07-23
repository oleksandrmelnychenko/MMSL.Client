import React from 'react';
import { ActionButton, Text, Stack } from 'office-ui-fabric-react';
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
import { assignPendingActions } from '../../helpers/action.helper';

export const FabricsHeader: React.FC = (props: any) => {
  const dispatch = useDispatch();

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
                  width: '600px',
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
              dispatch(
                assignPendingActions(
                  fabricActions.apiGetFabricVisibility(),
                  [],
                  [],
                  (args: any) => {
                    dispatch(fabricActions.changeTargetFabric(null));
                    dispatch(fabricActions.changeFabricVisibilities(args));
                    dispatch(
                      rightPanelActions.openRightPanel({
                        title: 'Configure fabric avaiability',
                        width: '400px',
                        panelType: RightPanelType.Form,
                        closeFunctions: () => {
                          dispatch(rightPanelActions.closeRightPanel());
                        },
                        component: FabricPropsVisibilityForm,
                      })
                    );
                  },
                  (args: any) => {}
                )
              );
            }}
            iconProps={{ iconName: 'Settings' }}
          >
            Configure fabric avaiability
          </ActionButton>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default FabricsHeader;
