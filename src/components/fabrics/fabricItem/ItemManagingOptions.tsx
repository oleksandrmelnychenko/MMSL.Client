import React from 'react';
import { Fabric } from '../../../interfaces/fabric';
import { Icon, Stack } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../common/fabric-styles/styles';
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

const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

export interface IItemInfoProps {
  fabric: Fabric;
}

const ItemInfo: React.FC<IItemInfoProps> = (props: IItemInfoProps) => {
  const dispatch = useDispatch();

  const fabrics: Fabric[] = useSelector<IApplicationState, Fabric[]>(
    (state) => state.fabric.fabrics
  );

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
      <Icon
        className={DATA_SELECTION_DISABLED_CLASS}
        iconName="Edit"
        title="Edit"
        ariaLabel="Edit"
        styles={fabricStyles.editCardIcon}
        onClick={() => onEdit()}
      />
                
      <Icon
        className={DATA_SELECTION_DISABLED_CLASS}
        iconName="Delete"
        title="Delete"
        ariaLabel="Delete"
        styles={fabricStyles.deleteIconRedColor}
        onClick={(event: any) => onDelete()}
      />
    </Stack>
  );
};

export default ItemInfo;
