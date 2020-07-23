import React from 'react';
import { Fabric } from '../../../interfaces/fabric';
import {
  Stack,
  IconButton,
  TooltipHost,
  DirectionalHint,
  Image,
  IImageProps,
  ImageFit,
} from 'office-ui-fabric-react';
import './fabricItem.scss';
import { useDispatch } from 'react-redux';
import {
  controlActions,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import {
  rightPanelActions,
  RightPanelType,
} from '../../../redux/slices/rightPanel.slice';
import { assignPendingActions } from '../../../helpers/action.helper';
import { fabricActions } from '../../../redux/slices/store/fabric/fabric.slice';
import FabricForm from '../managing/entity/FabricForm';
import './fabricItem.scss';
import { isUserCanManageFabrics } from '../../../helpers/fabric.helper';
import { fabricFiltersActions } from '../../../redux/slices/store/fabric/fabricFilters.slice';

export interface IItemManagingControlsProps {
  fabric: Fabric;
}

const ItemManagingControls: React.FC<IItemManagingControlsProps> = (
  props: IItemManagingControlsProps
) => {
  const dispatch = useDispatch();

  const canManageFabrics: boolean = isUserCanManageFabrics();

  const imageProps: IImageProps = {
    src: props.fabric.imageUrl,
    imageFit: ImageFit.none,
  };

  const onExplore = () => {
    dispatch(
      controlActions.toggleCommonDialogVisibility({
        dialogType: CommonDialogType.Content,
        title: props.fabric.fabricCode,
        subText: '',
        viewContent: (
          <>
            <Image {...imageProps} src={props.fabric.imageUrl}></Image>
          </>
        ),
        onSubmitClick: () => {},
        onDeclineClick: () => {},
      })
    );
  };

  const onDelete = () => {
    dispatch(
      controlActions.toggleCommonDialogVisibility({
        dialogType: CommonDialogType.Delete,
        title: 'Delete fabric',
        subText: `Are you sure you want to delete ${props.fabric.fabricCode}?`,
        onSubmitClick: () => {
          dispatch(
            assignPendingActions(
              fabricActions.apiDeleteFabricById(props.fabric.id),
              [],
              [],
              (args: any) => {
                dispatch(
                  assignPendingActions(
                    fabricFiltersActions.apiGetFilters(),
                    [],
                    [],
                    (args: any) => {
                      dispatch(
                        fabricFiltersActions.changeAndApplyFilters(args)
                      );

                      dispatch(
                        assignPendingActions(
                          fabricActions.apiGetAllFabricsPaginated(),
                          [],
                          [],
                          (args: any) => {
                            dispatch(
                              fabricActions.changeFabrics(args.entities)
                            );
                            dispatch(fabricActions.changeTargetFabric(null));
                          },
                          (args: any) => {}
                        )
                      );
                    },
                    (args: any) => {}
                  )
                );
              },
              (args: any) => {}
            )
          );
        },
        onDeclineClick: () => {},
      })
    );
  };

  const onEdit = () => {
    dispatch(fabricActions.changeTargetFabric(props.fabric));
    dispatch(
      rightPanelActions.openRightPanel({
        title: 'Details',
        description: props.fabric.fabricCode,
        width: '600px',
        panelType: canManageFabrics
          ? RightPanelType.Form
          : RightPanelType.ReadOnly,
        closeFunctions: () => {
          dispatch(rightPanelActions.closeRightPanel());
        },
        component: FabricForm,
      })
    );
  };

  return (
    <Stack horizontal>
      <Stack.Item grow={1}>
        <TooltipHost
          content="Explore"
          directionalHint={DirectionalHint.bottomRightEdge}
          id="ExploreImage"
          calloutProps={{ gapSpace: 0 }}
          styles={{ root: { display: 'inline-block', float: 'left' } }}
        >
          <IconButton
            iconProps={{
              iconName: 'RedEye',
              styles: { root: { fontSize: '22px' } },
            }}
            onClick={() => onExplore()}
          />
        </TooltipHost>
      </Stack.Item>

      <TooltipHost
        content="Details"
        directionalHint={DirectionalHint.bottomRightEdge}
        id="StyleSettings"
        calloutProps={{ gapSpace: 0 }}
        styles={{ root: { display: 'inline-block', float: 'left' } }}
      >
        <IconButton
          iconProps={{
            iconName: 'Settings',
          }}
          onClick={() => onEdit()}
        />
      </TooltipHost>

      {canManageFabrics ? (
        <TooltipHost
          content="Delete"
          directionalHint={DirectionalHint.bottomRightEdge}
          id="deleteStyle"
          calloutProps={{ gapSpace: 0 }}
          styles={{ root: { display: 'inline-block', float: 'left' } }}
        >
          <IconButton
            iconProps={{
              iconName: 'Delete',
            }}
            onClick={() => onDelete()}
          />
        </TooltipHost>
      ) : null}
    </Stack>
  );
};

export default ItemManagingControls;
