import React from 'react';
import {
  Text,
  Image,
  TooltipHost,
  Icon,
  Stack,
  TooltipDelay,
  DirectionalHint,
  FontIcon,
  mergeStyles,
} from 'office-ui-fabric-react';
import { OptionUnit, OptionGroup } from '../../../../interfaces/options';
import { ProductCategory } from '../../../../interfaces/products';
import { useDispatch, useSelector } from 'react-redux';
import {
  productSettingsActions,
  ManagingOptionUnitsState,
} from '../../../../redux/slices/productSettings.slice';
import {
  controlActions,
  CommonDialogType,
} from '../../../../redux/slices/control.slice';
import {
  rightPanelActions,
  RightPanelType,
} from '../../../../redux/slices/rightPanel.slice';
import { Card } from '@uifabric/react-cards';
import * as fabricStyles from '../../../../common/fabric-styles/styles';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { IApplicationState } from '../../../../redux/reducers';
import ManagingProductUnitForm from './../productSettingManagement/ManagingProductUnitForm';

export class UnitRowItemProps {
  constructor() {
    this.optionGroup = new OptionGroup();
    this.optionUnit = new OptionUnit();
    this.takeMarginWhenNoImage = false;
  }

  optionGroup: OptionGroup;
  optionUnit: OptionUnit;
  takeMarginWhenNoImage?: boolean;
}

const _buildGroupPriceHint = (unit: OptionUnit, group: OptionGroup) => {
  const color: string = '#2b579a';
  const semiColor: string = '#2b579a60';

  const renderPriceTooltip = (tooltipText: string, iconColor: string) => {
    return (
      <Stack.Item>
        <TooltipHost
          id={`priceTooltip_${group.id}`}
          calloutProps={{ gapSpace: 0 }}
          delay={TooltipDelay.zero}
          directionalHint={DirectionalHint.bottomCenter}
          styles={{
            root: { display: 'inline-block', position: 'relative', zIndex: 3 },
          }}
          content={tooltipText}
        >
          <FontIcon
            style={{ cursor: 'default' }}
            iconName="Money"
            className={mergeStyles({
              fontSize: 16,
              position: 'relative',
              top: '2px',
              color: iconColor,
            })}
          />
        </TooltipHost>
      </Stack.Item>
    );
  };

  let resultContent = null;

  if (unit.canDeclareOwnPrice) {
    if (unit.currentPrice?.currencyType) {
      resultContent = renderPriceTooltip(
        `${unit.currentPrice.price} ${unit.currentPrice.currencyType.name}`,
        color
      );
    } else {
      resultContent = renderPriceTooltip(`Free of charge`, semiColor);
    }
  } else {
    if (group.currentPrice?.currencyType) {
      resultContent = renderPriceTooltip(
        `Full style price ${group.currentPrice.price} ${group.currentPrice.currencyType.name}`,
        semiColor
      );
    } else {
      resultContent = renderPriceTooltip(
        `Full style is free of charge`,
        semiColor
      );
    }
  }

  return resultContent;
};

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

  const onRendedStyleOptionLabel = () => {
    let renderResult = null;

    const text = (
      <Text
        block
        nowrap
        variant="mediumPlus"
        styles={{
          ...fabricStyles.cardText,
          root: {
            ...fabricStyles.cardText.root,
            zIndex: 2,
            cursor: 'auto',
            marginTop: '0px',
          },
        }}
      >
        {props.optionUnit.value}
      </Text>
    );

    renderResult = text;

    if (props.optionUnit.value.length > 15) {
      renderResult = (
        <TooltipHost
          id={`styleOption_${props.optionUnit.id}`}
          calloutProps={{ gapSpace: 0 }}
          delay={TooltipDelay.zero}
          directionalHint={DirectionalHint.bottomCenter}
          styles={{
            root: { display: 'inline-block', zIndex: 2, cursor: 'auto' },
          }}
          content={props.optionUnit.value}
        >
          {text}
        </TooltipHost>
      );
    }

    return renderResult;
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
        <Card.Section styles={{ root: { marginTop: '0px !important' } }}>
          <Stack>
            {onRendedStyleOptionLabel()}
            {_buildGroupPriceHint(props.optionUnit, props.optionGroup)}
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
                      rightPanelActions.openRightPanel({
                        title: 'Details',
                        description: args.value,
                        width: '400px',
                        panelType: RightPanelType.Form,
                        closeFunctions: () => {
                          dispatch(rightPanelActions.closeRightPanel());
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
                controlActions.toggleCommonDialogVisibility({
                  dialogType: CommonDialogType.Delete,
                  title: 'Delete style option',
                  subText: `Are you sure you want to delete ${props.optionUnit.value}?`,
                  onSubmitClick: () => {
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
                  onDeclineClick: () => {},
                })
              );
            }}
          />
        </Card.Section>
      </Card>
    </div>
  );
};

export default UnitRowItem;
