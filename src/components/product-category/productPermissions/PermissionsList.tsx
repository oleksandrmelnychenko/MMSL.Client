import React, { useEffect, useState } from 'react';
import {
  ProductPermissionSettings,
  ProductCategory,
} from '../../../interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import {
  DetailsList,
  IconButton,
  IColumn,
  CheckboxVisibility,
  Selection,
  IRenderFunction,
  IDetailsHeaderProps,
  IDetailsColumnRenderTooltipProps,
  TooltipHost,
  Text,
  DetailsListLayoutMode,
  DetailsRow,
  ConstrainMode,
  SelectionMode,
} from 'office-ui-fabric-react';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import ProductPermissionForm from './managing/ProductPermissionForm';
import { productStylePermissionsActions } from '../../../redux/slices/productStylePermissions.slice';
import { assignPendingActions } from '../../../helpers/action.helper';
import { List } from 'linq-typescript';

const PermissionsList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {},
    })
  );

  const targetProduct = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  const permissions: ProductPermissionSettings[] = useSelector<
    IApplicationState,
    ProductPermissionSettings[]
  >((state) => state.productStylePermissions.permissionSettings);

  const permissionSettings: ProductPermissionSettings[] = useSelector<
    IApplicationState,
    ProductPermissionSettings[]
  >((state) => state.productStylePermissions.permissionSettings);

  /// Dispose own state
  useEffect(() => {
    return () => {};
  }, []);

  const onRenderRow = (renderArgs: any) => {
    renderArgs.onRenderDetailsCheckbox = (props?: any, defaultRender?: any) => {
      return (
        <IconButton
          menuProps={{
            onDismiss: (ev) => {},
            items: [
              {
                key: 'edit',
                text: 'Edit',
                label: 'Edit',
                iconProps: { iconName: 'Edit' },
                onClick: () => {
                  if (renderArgs?.item && targetProduct) {
                    dispatch(
                      productStylePermissionsActions.changeEditingPermissionSetting(
                        renderArgs.item
                      )
                    );

                    dispatch(
                      controlActions.openRightPanel({
                        title: 'Edit style permission',
                        description: renderArgs.item.description,
                        width: '400px',
                        closeFunctions: () => {
                          dispatch(controlActions.closeRightPanel());
                        },
                        component: ProductPermissionForm,
                      })
                    );
                  }
                },
              },
              {
                key: 'delete',
                text: 'Delete',
                label: 'Delete',
                iconProps: { iconName: 'Delete' },
                onClick: () => {
                  if (renderArgs?.item && targetProduct) {
                    dispatch(
                      controlActions.toggleCommonDialogVisibility(
                        new DialogArgs(
                          CommonDialogType.Delete,
                          'Delete style permission',
                          `Are you sure you want to delete ${renderArgs.item.name}?`,
                          () => {
                            if (renderArgs?.item && targetProduct) {
                              dispatch(
                                assignPendingActions(
                                  productStylePermissionsActions.apiDeletePermission(
                                    renderArgs.item.id
                                  ),
                                  [],
                                  [],
                                  (args: any) => {
                                    debugger;
                                    dispatch(
                                      productStylePermissionsActions.updatePermissionSettingsList(
                                        new List(permissionSettings)
                                          .where(
                                            (item) =>
                                              item.id !== renderArgs?.item?.id
                                          )
                                          .toArray()
                                      )
                                    );
                                  },
                                  (args: any) => {}
                                )
                              );
                            }
                          },
                          () => {}
                        )
                      )
                    );
                  }
                },
              },
            ],
            styles: {
              root: { width: '84px' },
              container: { width: '84px' },
            },
          }}
          onRenderMenuIcon={(props?: any, defaultRender?: any) => null}
          iconProps={{ iconName: 'More' }}
          onMenuClick={(ev?: any) => {}}
        />
      );
    };
    return <DetailsRow {...renderArgs} />;
  };

  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
    props,
    defaultRender
  ) => {
    if (!props) {
      return null;
    }
    const onRenderColumnHeaderTooltip: IRenderFunction<IDetailsColumnRenderTooltipProps> = (
      tooltipHostProps
    ) => (
      <div className="list__header">
        <TooltipHost {...tooltipHostProps} />
      </div>
    );

    // <DetailsHeader
    //       styles={{
    //         root: { fontWeight: FontWeights.light },
    //         accessibleLabel: { fontWeight: FontWeights.light },
    //       }}
    //       {...props}
    //     />

    return (
      // <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
      //   {defaultRender!({
      //     ...props,
      //     onRenderColumnHeaderTooltip,
      //   })}
      // </Sticky>
      <div>
        {defaultRender!({
          ...props,
          onRenderColumnHeaderTooltip,
        })}
      </div>
    );
  };

  const buildColumns = () => {
    return [
      {
        key: 'name',
        name: 'Name',
        minWidth: 50,
        maxWidth: 150,
        isResizable: true,
        isCollapsible: false,
        data: 'string',
        isPadded: false,
        onRender: (
          item?: ProductPermissionSettings,
          index?: number,
          column?: IColumn
        ) => {
          return (
            <Text block nowrap>
              {item?.name}
            </Text>
          );
        },
      },
      {
        key: 'description',
        name: 'Description',
        minWidth: 50,
        maxWidth: 150,
        isResizable: true,
        isCollapsible: false,
        data: 'string',
        isPadded: false,
        onRender: (
          item?: ProductPermissionSettings,
          index?: number,
          column?: IColumn
        ) => {
          return (
            <Text block nowrap>
              {item?.description}
            </Text>
          );
        },
      },
    ];
  };

  return (
    <div className="permissionsList">
      <DetailsList
        onRenderRow={onRenderRow}
        onRenderDetailsHeader={onRenderDetailsHeader}
        selection={selection}
        constrainMode={ConstrainMode.horizontalConstrained}
        isHeaderVisible={true}
        layoutMode={DetailsListLayoutMode.justified}
        items={permissions}
        selectionMode={SelectionMode.single}
        checkboxVisibility={CheckboxVisibility.onHover}
        columns={buildColumns()}
      />
    </div>
  );
};

export default PermissionsList;
