import React from 'react';
import { Fabric } from '../../../interfaces/fabric';
import { Icon, Image } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import { Card } from '@uifabric/react-cards';
import './fabricItem.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import { assignPendingActions } from '../../../helpers/action.helper';
import { fabricActions } from '../../../redux/slices/store/fabric/fabric.slice';
import { IApplicationState } from '../../../redux/reducers';
import { List } from 'linq-typescript';
import FabricForm from '../managing/FabricForm';

const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

export interface IFabricItemProps {
  fabric: Fabric;
}

const FabricItem: React.FC<IFabricItemProps> = (props: IFabricItemProps) => {
  const dispatch = useDispatch();

  const fabrics: Fabric[] = useSelector<IApplicationState, Fabric[]>(
    (state) => state.fabric.fabrics
  );

  const onDelete = () => {
    dispatch(
      controlActions.toggleCommonDialogVisibility(
        new DialogArgs(
          CommonDialogType.Delete,
          'Delete fabric',
          `Are you sure you want to delete ${props.fabric.fabricCode}?`,
          () => {
            dispatch(
              assignPendingActions(
                fabricActions.apiDeleteFabricById(props.fabric.id),
                [],
                [],
                (args: any) => {
                  dispatch(
                    fabricActions.changeFabrics(
                      new List(fabrics)
                        .where(
                          (fabric: Fabric) => fabric.id !== props.fabric.id
                        )
                        .toArray()
                    )
                  );
                },
                (args: any) => {}
              )
            );
          },
          () => {}
        )
      )
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
    <div className="fabricItem">
      <Card
        styles={{
          root: {
            minWidth: '200px',
            padding: '9px',
            borderRadius: '6px',
          },
        }}
        // className={chooseCategory?.id === category.id ? `selected` : ''}
        onClick={(args: any) => {
          const className: any = args?.target?.className;

          if (!className.includes(DATA_SELECTION_DISABLED_CLASS)) {
            // if (category.id !== chooseCategory?.id) {
            //   dispatch(
            //     assignPendingActions(
            //       productActions.apiGetProductCategoryById(category.id),
            //       [],
            //       [],
            //       (args: any) => {
            //         dispatch(productActions.chooseProductCategory(args));
            //         dispatch(
            //           controlActions.openInfoPanelWithComponent({
            //             component: ProductManagementPanel,
            //             onDismisPendingAction: () => {
            //               dispatch(productActions.chooseProductCategory(null));
            //             },
            //           })
            //         );
            //       }
            //     )
            //   );
            // }
          }
        }}
        tokens={fabricStyles.cardTokens}
      >
        <Card.Section fill verticalAlign="end">
          <Image
            src={props.fabric.imageUrl}
            styles={fabricStyles.marginImageCenter}
          ></Image>
        </Card.Section>
        {/* <Card.Section>{onRendedStyleOptionLabel(category)}</Card.Section> */}
        <Card.Section
          className="cardActions"
          horizontal
          styles={{
            ...fabricStyles.footerCardSectionStyles,
          }}
          tokens={fabricStyles.footerCardSectionTokens}
        >
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
        </Card.Section>
      </Card>
    </div>
  );
};

export default FabricItem;
