import React from 'react';
import { ActionButton, Text, Stack, SearchBox } from 'office-ui-fabric-react';
import { useDispatch, useSelector } from 'react-redux';
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
import { IApplicationState } from '../../redux/reducers';
import { assignPendingActions } from '../../helpers/action.helper';

export const FabricsHeader: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const searchWord: string = useSelector<IApplicationState, string>(
    (state) => state.fabric.searchWord
  );

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
              dispatch(fabricActions.changeTargetFabric(null));
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
            }}
            iconProps={{ iconName: 'Settings' }}
          >
            Configure fabric avaiability
          </ActionButton>
        </Stack>
      ) : null}

      <SearchBox
        styles={searchBoxStyles}
        value={searchWord}
        placeholder="Find fabric"
        onSearch={(args: any) => {
          dispatch(fabricActions.changeSearchWord(args ? args : ''));

          dispatch(
            assignPendingActions(
              fabricActions.apiGetAllFabricsPaginated(),
              [],
              [],
              (args: any) => {
                dispatch(fabricActions.changeFabrics(args.entities));
                dispatch(
                  fabricActions.changePaginationInfo(args.paginationInfo)
                );
              },
              (args: any) => {}
            )
          );
        }}
        onChange={(args: any) => {}}
      />
    </Stack>
  );
};

export default FabricsHeader;
