import React, { useEffect, useState } from 'react';
import { ProductPermissionSettings } from '../../../interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import {
  DetailsList,
  Stack,
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
  getId,
  CommandBarButton,
} from 'office-ui-fabric-react';

const PermissionsList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {},
    })
  );

  const permissions: ProductPermissionSettings[] = useSelector<
    IApplicationState,
    ProductPermissionSettings[]
  >((state) => state.productStylePermissions.permissionSettings);

  /// Dispose own state
  useEffect(() => {
    return () => {};
  }, []);

  const onRenderRow = (args: any) => {
    return <DetailsRow {...args} />;
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
