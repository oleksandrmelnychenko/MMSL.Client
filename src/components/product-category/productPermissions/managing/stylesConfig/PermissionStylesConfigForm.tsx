import React, { useState, useEffect } from 'react';
import { Stack, Separator, Label } from 'office-ui-fabric-react';
import {
  FormicReference,
  ProductCategory,
  ProductPermissionSettings,
  OptionGroup,
} from '../../../../../interfaces';
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
import { productSettingsActions } from '../../../../../redux/slices/productSettings.slice';

class InitValues {
  constructor() {
    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}

const _columnStyle = { root: { maxWidth: '100%', minWidth: '100%' } };

const _buildEditedPayload = (
  values: InitValues,
  sourceEntity: ProductPermissionSettings
) => {
  let payload: any = {
    name: values.name,
    description: values.description,
    permissionSettings: [],
    id: sourceEntity.id,
  };

  return payload;
};

const _initDefaultValues = (
  sourceEntity?: ProductPermissionSettings | null
) => {
  const initValues: InitValues = new InitValues();

  if (sourceEntity) {
  }

  return initValues;
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

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
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
      // setOptionGroupDefaults([]);
      setOptionGroupContexts([]);
      setLocalProductCategory(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formikReference) {
      dispatch(
        controlActions.setPanelButtons([
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            /// TODO: submit
            debugger;
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            buildGroupContexts();
            setFormikDirty(
              new List(optionGroupContexts).any((item) => item.isDirty())
            );
          }),
        ])
      );
    }
  }, [formikReference, dispatch]);

  useEffect(() => {
    if (new List(commandBarItems).any()) {
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
      setLocalProductCategory(productCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCategory]);

  /// Resolve available product styles (groups) due to
  /// local product category
  useEffect(() => {
    if (localProductCategory && editingSetting) {
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

    /// TODO: So so solution
    if (formikReference) {
      dispatch(
        controlActions.setPanelButtons([
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            /// TODO: submit
            debugger;
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            buildGroupContexts();
            setFormikDirty(
              new List(optionGroupContexts).any((item) => item.isDirty())
            );
          }),
        ])
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionGroupDefaults]);

  const buildGroupContexts = () => {
    const groups = new List(optionGroupDefaults)
      .select((item: OptionGroup) => {
        const result = new GroupAssigningContext(item);
        return result;
      })
      .toArray();

    setOptionGroupContexts(groups);
  };

  const editSetting = (values: InitValues) => {
    if (productCategory && editingSetting) {
      const payload = _buildEditedPayload(values, editingSetting);
      /// TODO:
    }
  };

  return (
    <div className="permissionStylesConfigForm">
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}
      >
        <Stack.Item grow={1} styles={_columnStyle}>
          <div data-is-scrollable={true}>
            <Separator
              styles={{ root: { marginBottom: '12px' } }}
              alignContent="start"
            >
              Allowed styles
            </Separator>
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
          </div>
        </Stack.Item>

        {/* <Stack.Item grow={1} styles={_columnStyle}>
          <div data-is-scrollable={true}>
            <Separator alignContent="start">Product styles</Separator>
          </div>
        </Stack.Item> */}
      </Stack>
    </div>
  );
};

export default PermissionStylesConfigForm;
