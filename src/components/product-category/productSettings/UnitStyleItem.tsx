import React from 'react';
import { Text, Image, Icon, Stack } from 'office-ui-fabric-react';
import { OptionUnit } from '../../../interfaces/options';
import { ProductCategory } from '../../../interfaces/products';
import { useDispatch, useSelector } from 'react-redux';
import {
  productSettingsActions,
  ManagingOptionUnitsState,
} from '../../../redux/slices/productSettings.slice';
import {
  controlActions,
  CommonDialogType,
  DialogArgs,
} from '../../../redux/slices/control.slice';
import { Card } from '@uifabric/react-cards';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import { assignPendingActions } from '../../../helpers/action.helper';
import { IApplicationState } from '../../../redux/reducers';
import ManagingProductUnitForm from './productSettingManagement/ManagingProductUnitForm';

export class UnitRowItemProps {
  constructor() {
    this.optionUnit = new OptionUnit();
    this.takeMarginWhenNoImage = false;
  }

  optionUnit: OptionUnit;
  takeMarginWhenNoImage?: boolean;
}

export const UnitRowItem: React.FC<UnitRowItemProps> = (
  props: UnitRowItemProps
) => {
  const dispatch = useDispatch();

  const targetProduct: ProductCategory | null = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const getProductStyles: (productId: number) => void = (productId: number) => {
    dispatch(
      assignPendingActions(
        productSettingsActions.apiGetAllOptionGroupsByProductIdList(productId),
        [],
        [],
        (args: any) => {
          dispatch(productSettingsActions.updateOptionGroupList(args));
        },
        (args: any) => {}
      )
    );
  };

  return (
    <div className="card" style={{ position: 'relative' }}>
      <Card
        styles={fabricStyles.cardStyle}
        onClick={(args: any) => {}}
        tokens={fabricStyles.cardTokens}
      >
        <Card.Section fill verticalAlign="end">
          <Image
            src={props.optionUnit.imageUrl}
            styles={fabricStyles.marginImageCenter}
          ></Image>
        </Card.Section>
        <Card.Section>
          <Stack horizontal>
            {/* Old flow */}
            {/* <Icon
              iconName={props.optionUnit.isMandatory ? 'Unlock' : 'Lock'}
              className={fabricStyles.cardIcon}
              styles={{
                root: {
                  color: allowColor,
                },
              }}
            /> */}
            <Text
              block
              nowrap
              variant="mediumPlus"
              styles={fabricStyles.cardText}
            >
              {props.optionUnit.value}
            </Text>
          </Stack>
        </Card.Section>
        <Card.Section
          className="card_actions"
          horizontal
          styles={fabricStyles.footerCardSectionStyles}
          tokens={fabricStyles.footerCardSectionTokens}
        >
          <Icon
            data-selection-disabled={true}
            styles={fabricStyles.editCardIcon}
            iconName="Edit"
            title="Edit"
            onClick={() => {
              dispatch(
                assignPendingActions(
                  productSettingsActions.apiGetOptionUnitById(
                    props.optionUnit.id
                  ),
                  [],
                  [],
                  (args: any) => {
                    const payload: ManagingOptionUnitsState = new ManagingOptionUnitsState();
                    payload.isOptionUnitFormVisible = true;
                    payload.optionUnits = [args];
                    payload.selectedOptionUnit = args;
                    payload.targetOptionGroup = null;
                    payload.isEditingSingleUnit = true;

                    dispatch(
                      productSettingsActions.changeManagingOptionUnitsState(
                        payload
                      )
                    );

                    dispatch(
                      controlActions.openRightPanel({
                        title: 'Details',
                        description: args.value,
                        width: '400px',
                        closeFunctions: () => {
                          dispatch(controlActions.closeRightPanel());
                        },
                        component: ManagingProductUnitForm,
                      })
                    );
                  },
                  (args: any) => {}
                )
              );
            }}
          />
          <Icon
            data-selection-disabled={true}
            styles={fabricStyles.deleteIconRedColor}
            iconName="Delete"
            title="Delete"
            onClick={(args: any) => {
              dispatch(
                controlActions.toggleCommonDialogVisibility(
                  new DialogArgs(
                    CommonDialogType.Delete,
                    'Delete option unit',
                    `Are you sure you want to delete ${props.optionUnit.value}?`,
                    () => {
                      let action = assignPendingActions(
                        productSettingsActions.apiDeleteOptionUnitById(
                          props.optionUnit.id
                        ),
                        [],
                        [],
                        (args: any) => {
                          if (targetProduct?.id)
                            getProductStyles(targetProduct.id);
                        }
                      );
                      dispatch(action);
                    },
                    () => {}
                  )
                )
              );
            }}
          />
        </Card.Section>
      </Card>
    </div>
  );
};

export default UnitRowItem;
