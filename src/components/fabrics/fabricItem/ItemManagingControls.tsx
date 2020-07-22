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
import { useDispatch, useSelector } from 'react-redux';
import {
  controlActions,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import { assignPendingActions } from '../../../helpers/action.helper';
import { fabricActions } from '../../../redux/slices/store/fabric/fabric.slice';
import { IApplicationState } from '../../../redux/reducers';
import { List } from 'linq-typescript';
import FabricForm from '../managing/FabricForm';
import './fabricItem.scss';

export interface IItemManagingControlsProps {
  fabric: Fabric;
}

const ItemManagingControls: React.FC<IItemManagingControlsProps> = (
  props: IItemManagingControlsProps
) => {
  const dispatch = useDispatch();

  const fabrics: Fabric[] = useSelector<IApplicationState, Fabric[]>(
    (state) => state.fabric.fabrics
  );

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
                  fabricActions.changeFabrics(
                    new List(fabrics)
                      .where((fabric: Fabric) => fabric.id !== props.fabric.id)
                      .toArray()
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
      controlActions.openRightPanel({
        title: 'Details',
        description: props.fabric.fabricCode,
        width: '900px',
        closeFunctions: () => {
          dispatch(controlActions.closeRightPanel());
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
        content="Edit"
        directionalHint={DirectionalHint.bottomRightEdge}
        id="StyleSettings"
        calloutProps={{ gapSpace: 0 }}
        styles={{ root: { display: 'inline-block', float: 'left' } }}
      >
        <IconButton
          iconProps={{
            iconName: 'Edit',
          }}
          onClick={() => onEdit()}
        />
      </TooltipHost>

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
    </Stack>
  );
};

export default ItemManagingControls;
