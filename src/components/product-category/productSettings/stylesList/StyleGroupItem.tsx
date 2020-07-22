import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../../redux/reducers';
import { OptionGroup, OptionUnit } from '../../../../interfaces/options';
import { ProductCategory } from '../../../../interfaces/products';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { productSettingsActions } from '../../../../redux/slices/productSettings.slice';
import UnitRowItem from './UnitStyleItem';
import {
  Stack,
  TooltipHost,
  DirectionalHint,
  TooltipDelay,
  FontIcon,
  Text,
  mergeStyles,
  Separator,
  IconButton,
  FontWeights,
} from 'office-ui-fabric-react';
import {
  controlActions,
  CommonDialogType,
} from '../../../../redux/slices/control.slice';
import {
  rightPanelActions,
  RightPanelType,
} from '../../../../redux/slices/rightPanel.slice';
import './styleGroupItem.scss';
import { ManagingvOptionGroupForm } from './../productSettingManagement/ManagingProductGroupForm';
import { OptionGroupDetails } from './../productSettingManagement/OptionGroupDetails';
import { renderHintLable } from '../../../../helpers/uiComponent.helper';
import { ExpandableItem } from '../../../../interfaces';

export interface IStyleGroupItemProps {
  expandableStyleGroup: ExpandableItem;
}

export const buildGroupMandatoryHint = (group: OptionGroup) => {
  return (
    <TooltipHost
      id={`mandatoryTooltip_${group.id}`}
      calloutProps={{ gapSpace: 0 }}
      delay={TooltipDelay.zero}
      directionalHint={DirectionalHint.bottomCenter}
      styles={{ root: { display: 'inline-block' } }}
      content={group.isMandatory ? 'Mandatory' : 'Not mandatory'}
    >
      <FontIcon
        style={{ cursor: 'default' }}
        iconName="Warning"
        className={mergeStyles({
          fontSize: 16,
          position: 'relative',
          top: '2px',
          color: group.isMandatory ? '#2b579a' : '#2b579a60',
        })}
      />
    </TooltipHost>
  );
};

const _buildGroupPriceHint = (group: OptionGroup) => {
  const color: string = '#2b579a';
  const semiColor: string = '#2b579a60';

  const renderPriceTooltip = (tooltipText: string, iconColor: string) => {
    return (
      <Stack.Item align="end">
        <TooltipHost
          id={`priceTooltip_${group.id}`}
          calloutProps={{ gapSpace: 0 }}
          delay={TooltipDelay.zero}
          directionalHint={DirectionalHint.bottomCenter}
          styles={{ root: { display: 'inline-block' } }}
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

  if (group.canDeclareOwnPrice) {
    if (group.currentPrice?.currencyType) {
      resultContent = renderPriceTooltip(
        `${group.currentPrice.price} ${group.currentPrice.currencyType.name}`,
        color
      );
    } else {
      resultContent = renderPriceTooltip(`Free of charge`, semiColor);
    }
  } else {
    resultContent = renderPriceTooltip(
      `The price for style is consists of prices of the style options`,
      semiColor
    );
  }

  return resultContent;
};

const _groupContainerStyle = {
  root: {
    height: '40px',
    borderBottom: '1px solid rgb(243, 242, 241)',
    borderTop: '1px solid rgb(243, 242, 241)',
    marginBottom: '15px',
    marginTop: '15px',
  },
};

const _textStackStyle = {
  root: {
    fontSize: '15px',
    fontWeight: FontWeights.semibold,
  },
};

export const StyleGroupItem: React.FC<IStyleGroupItemProps> = (
  props: IStyleGroupItemProps
) => {
  const dispatch = useDispatch();

  const [isExpanded, setIsExpanded] = useState<boolean>();

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
    <div className={isExpanded ? 'styleGroupItem expanded' : 'styleGroupItem'}>
      <Stack tokens={{ childrenGap: 12 }}>
        <Stack
          horizontal
          verticalAlign="center"
          // horizontalAlign="space-between"
          tokens={{ childrenGap: 12 }}
          styles={_groupContainerStyle}
        >
          <IconButton
            iconProps={{
              iconName: isExpanded ? 'ChevronDownMed' : 'ChevronRightMed',
            }}
            onClick={() => setIsExpanded(!isExpanded)}
          />

          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Stack.Item align="end">
              <Text styles={_textStackStyle}>
                {props.expandableStyleGroup.item.name}
              </Text>
            </Stack.Item>
            <Stack.Item align="end">
              {buildGroupMandatoryHint(props.expandableStyleGroup.item)}
            </Stack.Item>

            {_buildGroupPriceHint(props.expandableStyleGroup.item)}
          </Stack>

          <Separator vertical styles={{ root: { height: '26px' } }} />

          <Stack horizontal tokens={{ childrenGap: 0 }}>
            <TooltipHost
              content="Settings"
              directionalHint={DirectionalHint.bottomRightEdge}
              id="StyleSettings"
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <IconButton
                iconProps={{
                  iconName: 'Settings',
                }}
                onClick={() => {
                  dispatch(
                    assignPendingActions(
                      productSettingsActions.apiGetOptionGroupById(
                        props.expandableStyleGroup.item.id
                      ),
                      [],
                      [],
                      (args: any) => {
                        dispatch(
                          productSettingsActions.changeTargetOptionGroupForUnitsEdit(
                            args
                          )
                        );
                        dispatch(
                          rightPanelActions.openRightPanel({
                            title: 'Manage Style',
                            description: props.expandableStyleGroup.item.name,
                            width: '700px',
                            panelType: RightPanelType.Form,
                            closeFunctions: () => {
                              dispatch(rightPanelActions.closeRightPanel());
                            },
                            component: OptionGroupDetails,
                          })
                        );
                      },
                      (args: any) => {}
                    )
                  );
                }}
              />
            </TooltipHost>

            <TooltipHost
              content="Edit"
              directionalHint={DirectionalHint.bottomRightEdge}
              id="EditStyle"
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <IconButton
                iconProps={{
                  iconName: 'Edit',
                }}
                onClick={() => {
                  if (targetProduct && props.expandableStyleGroup.item) {
                    dispatch(
                      assignPendingActions(
                        productSettingsActions.apiGetOptionGroupById(
                          props.expandableStyleGroup.item.id
                        ),
                        [],
                        [],
                        (args: any) => {
                          dispatch(
                            productSettingsActions.changeEditingGroup(args)
                          );
                          dispatch(
                            rightPanelActions.openRightPanel({
                              title: 'Details',
                              description: args.name,
                              width: '400px',
                              panelType: RightPanelType.Form,
                              closeFunctions: () => {
                                dispatch(rightPanelActions.closeRightPanel());
                              },
                              component: ManagingvOptionGroupForm,
                            })
                          );
                        },
                        (args: any) => {}
                      )
                    );
                  }
                }}
              />
            </TooltipHost>

            <TooltipHost
              content="Delete"
              directionalHint={DirectionalHint.bottomRightEdge}
              id="deleteStyle"
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <IconButton
                iconProps={{
                  iconName: 'Delete',
                }}
                onClick={() => {
                  dispatch(
                    controlActions.toggleCommonDialogVisibility({
                      dialogType: CommonDialogType.Delete,
                      title: 'Delete style',
                      subText: `Are you sure you want to delete ${props.expandableStyleGroup.item.name}?`,
                      onSubmitClick: () => {
                        let action = assignPendingActions(
                          productSettingsActions.apiDeleteOptionGroupById(
                            props.expandableStyleGroup.item.id
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
            </TooltipHost>
          </Stack>
        </Stack>

        {isExpanded ? (
          <Stack
            wrap={true}
            className="stack_option"
            horizontal
            tokens={{ childrenGap: 20 }}
          >
            {props.expandableStyleGroup.item.optionUnits &&
            props.expandableStyleGroup.item.optionUnits.length > 0 ? (
              props.expandableStyleGroup.item.optionUnits.map(
                (item: OptionUnit, index: number) => (
                  <React.Fragment key={index}>
                    <UnitRowItem
                      optionUnit={item}
                      optionGroup={
                        props.expandableStyleGroup.item as OptionGroup
                      }
                    />
                  </React.Fragment>
                )
              )
            ) : (
              <div style={{ marginLeft: '9px', marginTop: '-6px' }}>
                {renderHintLable(`Current style does not have any options. `)}
              </div>
            )}
          </Stack>
        ) : null}
      </Stack>
    </div>
  );
};

export default StyleGroupItem;
