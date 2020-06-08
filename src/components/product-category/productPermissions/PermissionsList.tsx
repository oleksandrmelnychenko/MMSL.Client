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
import { defaultCellStyle } from '../../../common/fabric-styles/styles';
import PermissionStylesConfigForm from './managing/stylesConfig/PermissionStylesConfigForm';

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

  const onExploreDetails = (permissionId: number | null | undefined) => {
    if (permissionId && targetProduct) {
      dispatch(
        assignPendingActions(
          productStylePermissionsActions.apiGetPermissionById(permissionId),
          [],
          [],
          (args: any) => {
            dispatch(
              productStylePermissionsActions.changeEditingPermissionSetting(
                args
              )
            );
            dispatch(
              controlActions.openRightPanel({
                title: 'Details',
                description: args.name,
                width: '400px',
                closeFunctions: () => {
                  dispatch(controlActions.closeRightPanel());
                },
                component: PermissionStylesConfigForm,
              })
            );
          },
          (args: any) => {}
        )
      );
    }
  };

  const onEditPermission = (permissionId: number | null | undefined) => {
    if (permissionId && targetProduct) {
      dispatch(
        assignPendingActions(
          productStylePermissionsActions.apiGetPermissionById(permissionId),
          [],
          [],
          (args: any) => {
            dispatch(
              productStylePermissionsActions.changeEditingPermissionSetting(
                args
              )
            );

            dispatch(
              controlActions.openRightPanel({
                title: 'Edit style permission',
                description: args.name,
                width: '400px',
                closeFunctions: () => {
                  dispatch(controlActions.closeRightPanel());
                },
                component: ProductPermissionForm,
              })
            );
          },
          (args: any) => {}
        )
      );
    }
  };

  const onDeletePermission = (permission: ProductPermissionSettings) => {
    if (permission && targetProduct) {
      dispatch(
        controlActions.toggleCommonDialogVisibility(
          new DialogArgs(
            CommonDialogType.Delete,
            'Delete style permission',
            `Are you sure you want to delete ${permission.name}?`,
            () => {
              if (permission && targetProduct) {
                dispatch(
                  assignPendingActions(
                    productStylePermissionsActions.apiDeletePermission(
                      permission.id
                    ),
                    [],
                    [],
                    (args: any) => {
                      dispatch(
                        productStylePermissionsActions.updatePermissionSettingsList(
                          new List(permissionSettings)
                            .where((item) => item.id !== permission.id)
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
  };

  const onRenderRow = (renderArgs: any) => {
    renderArgs.onRenderDetailsCheckbox = (props?: any, defaultRender?: any) => {
      return (
        <IconButton
          menuProps={{
            onDismiss: (ev) => {},
            items: [
              {
                key: 'details',
                text: 'Details',
                label: 'Details',
                iconProps: {
                  iconName: 'Settings',
                },
                onClick: () => onExploreDetails(renderArgs?.item?.id),
              },
              {
                key: 'edit',
                text: 'Edit',
                label: 'Edit',
                iconProps: { iconName: 'Edit' },
                onClick: () => onEditPermission(renderArgs?.item?.id),
              },
              {
                key: 'delete',
                text: 'Delete',
                label: 'Delete',
                iconProps: { iconName: 'Delete' },
                onClick: () => onDeletePermission(renderArgs.item),
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
        key: 'index',
        name: '',
        minWidth: 16,
        maxWidth: 24,
        onColumnClick: () => {},
        onRender: (item: any, index?: number) => {
          return (
            <Text style={defaultCellStyle}>
              {index !== null && index !== undefined ? index + 1 : -1}
            </Text>
          );
        },
      },
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
            <Text block nowrap style={defaultCellStyle}>
              {`${item?.name}`}
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
            <Text block nowrap style={defaultCellStyle}>
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
