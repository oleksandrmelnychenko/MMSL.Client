import React, { useState, useEffect } from 'react';
import { Stack, Label, Separator } from 'office-ui-fabric-react';
import { OptionGroup } from '../../../../../interfaces';
import { ProductCategory } from '../../../../../interfaces/products';
import { ProductPermissionSettings } from '../../../../../interfaces/products';
import { List } from 'linq-typescript';
import { useDispatch, useSelector } from 'react-redux';
import { controlActions } from '../../../../../redux/slices/control.slice';
import {
  CommandBarItem,
  GetCommandBarItemProps,
  ChangeItemsDisabledState,
} from '../../../../../helpers/commandBar.helper';
import { IApplicationState } from '../../../../../redux/reducers';
import { productStylePermissionsActions } from '../../../../../redux/slices/productStylePermissions.slice';
import StyleGroupAssigningItem, {
  GroupAssigningContext,
} from './StyleGroupAssigningItem';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { UnitAssigningContext } from './StyleUnitAssigningItem';

const _columnStyle = { root: { maxWidth: '100%', minWidth: '100%' } };

const _buildEditedPayload = (
  assignments: GroupAssigningContext[],
  sourceEntity: ProductPermissionSettings
) => {
  let payload: any = {
    id: sourceEntity.id,
    name: sourceEntity.name,
    description: sourceEntity.description,
    permissionSettings: new List(assignments)
      .selectMany(
        (groupContext: GroupAssigningContext) => groupContext.styleUnits
      )
      .where((unitContext) => unitContext.isDirty())
      .select((unitContext: UnitAssigningContext) => {
        const itemPayload = {
          id: unitContext.getSourceUnitId(),
          isAllow: unitContext.checked,
          optionUnitId: unitContext.getSourceUnitId(),
          optionGroupId: unitContext.getSourceGroupId(),
        };

        return itemPayload;
      })
      .toArray(),
  };

  return payload;
};

/// Build single hint lable
const _renderHintLable = (textMessage: string): JSX.Element => {
  const result = (
    <Label
      styles={{
        root: {
          fontWeight: 400,
          fontSize: '12px',
          color: '#a19f9d',
        },
      }}
    >
      {textMessage}
    </Label>
  );

  return result;
};

export const PermissionStylesConfigForm: React.FC = () => {
  const dispatch = useDispatch();

  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);
  const [localProductCategory, setLocalProductCategory] = useState<
    ProductCategory | null | undefined
  >(null);
  const [optionGroupDefaults, setOptionGroupDefaults] = useState<OptionGroup[]>(
    []
  );
  const [optionGroupContexts, setOptionGroupContexts] = useState<
    GroupAssigningContext[]
  >([]);

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const productCategory = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const permissionSettings: ProductPermissionSettings[] = useSelector<
    IApplicationState,
    ProductPermissionSettings[]
  >((state) => state.productStylePermissions.permissionSettings);

  const editingSetting = useSelector<
    IApplicationState,
    ProductPermissionSettings | null | undefined
  >((state) => state.productStylePermissions.editingPermissionSetting);

  /// Disposing form
  useEffect(() => {
    return () => {
      if (editingSetting)
        dispatch(
          productStylePermissionsActions.changeEditingPermissionSetting(null)
        );
      setOptionGroupDefaults([]);
      setOptionGroupContexts([]);
      setLocalProductCategory(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (new List(commandBarItems).any()) {
      updatePanelButtons();
      dispatch(
        controlActions.setPanelButtons(
          ChangeItemsDisabledState(
            commandBarItems,
            [CommandBarItem.Reset, CommandBarItem.Save],
            !isFormikDirty
          )
        )
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormikDirty, dispatch]);

  /// Resolve local product category due to global category
  useEffect(() => {
    if (localProductCategory?.id !== productCategory?.id) {
      updatePanelButtons();
      setLocalProductCategory(productCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCategory]);

  /// Resolve available product styles (groups) due to
  /// local product category
  useEffect(() => {
    if (localProductCategory && editingSetting) {
      updatePanelButtons();
      dispatch(
        assignPendingActions(
          productStylePermissionsActions.apiGetOptionGroupsFromPermissionPerspectiveById(
            {
              productId: localProductCategory.id,
              productPermissionSettingId: editingSetting.id,
            }
          ),
          [],
          [],
          (args: any[]) => {
            setOptionGroupDefaults(args);
          },
          (args: any) => {
            setOptionGroupDefaults([]);
          }
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localProductCategory, editingSetting]);

  useEffect(() => {
    buildGroupContexts();

    updatePanelButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionGroupDefaults]);

  useEffect(() => {
    updatePanelButtons();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionGroupContexts]);

  const updatePanelButtons = () => {
    dispatch(
      controlActions.setPanelButtons([
        GetCommandBarItemProps(CommandBarItem.Save, () => {
          editSetting();
        }),
        GetCommandBarItemProps(CommandBarItem.Reset, () => {
          buildGroupContexts();
          setFormikDirty(false);
        }),
      ])
    );
  };

  const buildGroupContexts = () => {
    const groups = new List(optionGroupDefaults)
      .select((item: OptionGroup) => {
        const result = new GroupAssigningContext(item);
        return result;
      })
      .toArray();

    setOptionGroupContexts(groups);
  };

  const editSetting = () => {
    if (productCategory && editingSetting) {
      const payload = _buildEditedPayload(optionGroupContexts, editingSetting);

      dispatch(
        assignPendingActions(
          productStylePermissionsActions.apiUpdatePermission(payload),
          [],
          [],
          (args: any) => {
            dispatch(
              productStylePermissionsActions.updatePermissionSettingsList(
                new List(permissionSettings)
                  .select((item) => {
                    let result = item;

                    if (item.id === args.body.id) {
                      result = args.body;
                    }

                    return result;
                  })
                  .toArray()
              )
            );
            dispatch(
              productStylePermissionsActions.changeEditingPermissionSetting(
                args.body
              )
            );
            setFormikDirty(false);
            // dispatch(controlActions.closeRightPanel());
          },
          (args: any) => {}
        )
      );
    }
  };

  return (
    <div className="permissionStylesConfigForm">
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}
      >
        {/* <Stack.Item grow={1} styles={_columnStyle}>
          <Stack tokens={{ childrenGap: 6 }}>
            <Separator alignContent="start">Allowed styles</Separator>
            <AllowedList optionGroups={optionGroupDefaults} />
          </Stack>
        </Stack.Item> */}

        <Stack.Item grow={1} styles={_columnStyle}>
          <Stack tokens={{ childrenGap: 6 }}>
            <Separator alignContent="start">Styles</Separator>
            <Stack tokens={{ childrenGap: 9 }}>
              {optionGroupContexts.length > 0
                ? optionGroupContexts.map(
                    (item: GroupAssigningContext, index: number) => (
                      <StyleGroupAssigningItem
                        key={index}
                        context={item}
                        changedCallback={() => {
                          setFormikDirty(
                            new List(optionGroupContexts).any((item) =>
                              item.isDirty()
                            )
                          );
                        }}
                      />
                    )
                  )
                : _renderHintLable(
                    'There are no defined styles for this product.'
                  )}
            </Stack>
          </Stack>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default PermissionStylesConfigForm;
