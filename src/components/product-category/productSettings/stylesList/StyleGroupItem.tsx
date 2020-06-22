import React from 'react';
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
  DialogArgs,
  CommonDialogType,
} from '../../../../redux/slices/control.slice';
import './styleGroupItem.scss';
import { ManagingvOptionGroupForm } from './../productSettingManagement/ManagingProductGroupForm';
import { OptionGroupDetails } from './../productSettingManagement/OptionGroupDetails';
import { renderHintLable } from '../../../../helpers/uiComponent.helper';

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

export interface IStyleGroupItemProps {
  styleGroup: OptionGroup;
}

const _groupContainerStyle = {
  root: {
    height: '40px',
    borderBottom: '1px solid rgb(243, 242, 241)',
    borderTop: '1px solid rgb(243, 242, 241)',
    // borderBottom: '1px solid #dfdfdf',
    // borderTop: '1px solid #dfdfdf',
    // paddingTop: '5px',
    // paddingBottom: '5px',
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
    <div className="styleGroupItem">
      <Stack tokens={{ childrenGap: 12 }}>
        <Stack
          horizontal
          verticalAlign="center"
          // horizontalAlign="space-between"
          tokens={{ childrenGap: 12 }}
          styles={_groupContainerStyle}
        >
          {/* <IconButton
            iconProps={{
              iconName: 'ChevronDownMed',
            }}
            onClick={() => {}}
          /> */}

          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Stack.Item align="end">
              <Text styles={_textStackStyle}>{props.styleGroup.name}</Text>
            </Stack.Item>
            <Stack.Item align="end">
              {buildGroupMandatoryHint(props.styleGroup)}
            </Stack.Item>
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
                  let action = assignPendingActions(
                    productSettingsActions.apiGetOptionGroupById(
                      props.styleGroup.id
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
                        controlActions.openRightPanel({
                          title: 'Manage Style',
                          description: props.styleGroup.name,
                          width: '700px',
                          closeFunctions: () => {
                            dispatch(controlActions.closeRightPanel());
                          },
                          component: OptionGroupDetails,
                        })
                      );
                    },
                    (args: any) => {}
                  );
                  dispatch(action);
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
                  if (targetProduct && props.styleGroup) {
                    dispatch(
                      productSettingsActions.changeEditingGroup(
                        props.styleGroup
                      )
                    );
                    dispatch(
                      controlActions.openRightPanel({
                        title: 'Details',
                        description: props.styleGroup.name,
                        width: '400px',
                        closeFunctions: () => {
                          dispatch(controlActions.closeRightPanel());
                        },
                        component: ManagingvOptionGroupForm,
                      })
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
                    controlActions.toggleCommonDialogVisibility(
                      new DialogArgs(
                        CommonDialogType.Delete,
                        'Delete style',
                        `Are you sure you want to delete ${props.styleGroup.name}?`,
                        () => {
                          let action = assignPendingActions(
                            productSettingsActions.apiDeleteOptionGroupById(
                              props.styleGroup.id
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
            </TooltipHost>
          </Stack>
        </Stack>

        <Stack
          wrap={true}
          className="stack_option"
          horizontal
          tokens={{ childrenGap: 20 }}
        >
          {props.styleGroup.optionUnits &&
          props.styleGroup.optionUnits.length > 0 ? (
            props.styleGroup.optionUnits.map((item: OptionUnit) => (
              <React.Fragment key={item.id}>
                <UnitRowItem optionUnit={item} />
              </React.Fragment>
            ))
          ) : (
            <div style={{ marginLeft: '9px' }}>
              {renderHintLable(`Current style does not have any options. `)}
            </div>
          )}
        </Stack>
      </Stack>
    </div>
  );
};

export default StyleGroupItem;
