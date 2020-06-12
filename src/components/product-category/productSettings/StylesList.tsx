import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { OptionGroup, OptionUnit } from '../../../interfaces/options';
import { ProductCategory } from '../../../interfaces/products';
import { assignPendingActions } from '../../../helpers/action.helper';
import { productSettingsActions } from '../../../redux/slices/productSettings.slice';
import { List } from 'office-ui-fabric-react/lib/List';
import UnitRowItem from './UnitStyleItem';
import {
  Stack,
  TooltipHost,
  DirectionalHint,
  TooltipDelay,
  FontIcon,
  Text,
  mergeStyles,
  ActionButton,
} from 'office-ui-fabric-react';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import { ManagingvOptionGroupForm } from './productSettingManagement/ManagingProductGroupForm';
import { OptionGroupDetails } from './productSettingManagement/OptionGroupDetails';

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
          color: group.isMandatory ? '#2b579a' : '#2b579a60',
        })}
      />
    </TooltipHost>
  );
};

export const StylesList: React.FC = () => {
  const dispatch = useDispatch();

  const targetProduct: ProductCategory | null = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const outionGroups: OptionGroup[] = useSelector<
    IApplicationState,
    OptionGroup[]
  >((state) => state.productSettings.optionGroupsList);

  useEffect(() => {
    if (targetProduct?.id) getProductStyles(targetProduct.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

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

  const onRenderCell = (item: any, index: number | undefined): JSX.Element => {
    return (
      <div>
        <Stack
          className="option-group__header"
          horizontal
          verticalAlign="center"
          horizontalAlign="space-between"
          tokens={{ childrenGap: 0 }}
          styles={fabricStyles.stackStyleList}
        >
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Text styles={fabricStyles.textStackStyle}>{item.name}</Text>
            {buildGroupMandatoryHint(item)}
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <ActionButton
              styles={fabricStyles.columnIconButtonStyle}
              iconProps={{
                iconName: 'Settings',
              }}
              title="Settings"
              ariaLabel="Settings"
              onClick={() => {
                let action = assignPendingActions(
                  productSettingsActions.apiGetOptionGroupById(
                    parseInt(item.id)
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
                        description: item.name,
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

            <ActionButton
              styles={fabricStyles.columnIconButtonStyle}
              iconProps={{
                iconName: 'Edit',
              }}
              title="Edit"
              ariaLabel="Edit"
              onClick={() => {
                if (targetProduct && item) {
                  dispatch(productSettingsActions.changeEditingGroup(item));
                  dispatch(
                    controlActions.openRightPanel({
                      title: 'Details',
                      description: item.name,
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

            <ActionButton
              styles={fabricStyles.columnIconButtonStyle}
              iconProps={{
                iconName: 'Delete',
              }}
              title="Delete"
              ariaLabel="Delete"
              onClick={() => {
                dispatch(
                  controlActions.toggleCommonDialogVisibility(
                    new DialogArgs(
                      CommonDialogType.Delete,
                      'Delete option group',
                      `Are you sure you want to delete ${item.name}?`,
                      () => {
                        let action = assignPendingActions(
                          productSettingsActions.deleteOptionGroupById(item.id),
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
          </Stack>
        </Stack>

        <Stack
          wrap={true}
          className="stack_option"
          horizontal
          tokens={{ childrenGap: 20 }}
        >
          {item.optionUnits
            ? item.optionUnits.map((item: OptionUnit) => (
                <React.Fragment key={item.id}>
                  <UnitRowItem optionUnit={item} />
                </React.Fragment>
              ))
            : null}
        </Stack>
      </div>
    );
  };

  return (
    <div className="wrapper-list">
      <List items={outionGroups} onRenderCell={onRenderCell} />
    </div>
  );
};

export default StylesList;
