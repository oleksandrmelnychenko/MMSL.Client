import React, { useEffect } from 'react';
import {
  IColumn,
  SelectionMode,
  Text,
  ShimmeredDetailsList,
  IDetailsHeaderProps,
  IRenderFunction,
  TooltipHost,
  Sticky,
  StickyPositionType,
  IDetailsColumnRenderTooltipProps,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  controlActions,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import {
  detailsListStyle,
  columnIconButtonStyle,
  cellStyle,
} from '../../../common/fabric-styles/styles';
import {
  ProductDeliveryTimeline,
  ProductDeliveryTimelineSelected,
} from '../../../interfaces/deliveryTimelines';
import { ProductCategory } from '../../../interfaces/products';
import { ActionButton } from 'office-ui-fabric-react';
import { IApplicationState } from '../../../redux/reducers/index';
import ProductDeliverTimelineForm from './ProductDeliverTimelineForm';
import { productActions } from '../../../redux/slices/product.slice';
import { assignPendingActions } from '../../../helpers/action.helper';

export const DeliveriesList: React.FC = () => {
  const dispatch = useDispatch();

  const targetProduct = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  const shimmer = useSelector<IApplicationState, boolean>(
    (state) => state.control.isGlobalShimmerActive
  );

  useEffect(() => {
    dispatch(controlActions.showGlobalShimmer());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      targetProduct &&
      targetProduct.deliveryTimelineProductMaps &&
      targetProduct.deliveryTimelineProductMaps.length > 0
    ) {
      dispatch(controlActions.hideGlobalShimmer());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetProduct, targetProduct?.deliveryTimelineProductMaps]);

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
    return (
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
        {defaultRender!({
          ...props,
          onRenderColumnHeaderTooltip,
        })}
      </Sticky>
    );
  };

  const deleteDeliveryTimeline = (
    timeline: ProductDeliveryTimelineSelected
  ) => {
    let result = new ProductDeliveryTimeline();
    result.productCategoryId = timeline.productCategoryId;
    let deleteTimeline = timeline.deliveryTimeline;
    deleteTimeline.isDeleted = true;
    result.deliveryTimelines.push(deleteTimeline);

    dispatch(
      assignPendingActions(
        productActions.assignProductDeliveryTimeline(result),
        [],
        [],
        (args: any) => {
          if (targetProduct) {
            dispatch(
              assignPendingActions(
                productActions.apiGetProductCategoryById(targetProduct.id),
                [],
                [],
                (args: any) => {
                  dispatch(productActions.chooseProductCategory(args));
                },
                (args: any) => {}
              )
            );
          }
        },
        (args: any) => {}
      )
    );
  };

  const _customerColumns: IColumn[] = [
    {
      key: 'name',
      name: '',
      minWidth: 16,
      maxWidth: 200,

      onRender: (item: any, index?: number) => {
        return <Text style={cellStyle}>{item.deliveryTimeline.name}</Text>;
      },
    },
    {
      key: 'ivory',
      name: 'Ivory',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text style={cellStyle}>{item.deliveryTimeline.ivory}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'silver',
      name: 'Silver',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text style={cellStyle}>{item.deliveryTimeline.silver}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'black',
      name: 'Black',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text style={cellStyle}>{item.deliveryTimeline.black}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'gold',
      name: 'Gold',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text style={cellStyle}>{item.deliveryTimeline.gold}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'action',
      name: 'Action',
      minWidth: 70,
      maxWidth: 200,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return (
          <>
            <ActionButton
              styles={columnIconButtonStyle}
              iconProps={{ iconName: 'Edit' }}
              onClick={() => {
                dispatch(productActions.selectedTimeline(item));
                dispatch(
                  controlActions.openRightPanel({
                    title: 'Edit timeline',
                    description: item.deliveryTimeline.name,
                    width: '400px',
                    closeFunctions: () => {
                      dispatch(controlActions.closeRightPanel());
                    },
                    component: ProductDeliverTimelineForm,
                  })
                );
              }}
            ></ActionButton>
            <ActionButton
              styles={columnIconButtonStyle}
              iconProps={{ iconName: 'Delete' }}
              onClick={() => {
                dispatch(
                  controlActions.toggleCommonDialogVisibility({
                    dialogType: CommonDialogType.Delete,
                    title: 'Delete delivery timeline',
                    subText: `Are you sure you want to delete ${item.deliveryTimeline.name}?`,
                    onSubmitClick: () => {
                      deleteDeliveryTimeline(item);
                    },
                    onDeclineClick: () => {},
                  })
                );
              }}
            ></ActionButton>
          </>
        );
      },
      isPadded: true,
    },
  ];

  return (
    <div>
      <ShimmeredDetailsList
        onRenderDetailsHeader={onRenderDetailsHeader}
        enableShimmer={shimmer}
        styles={detailsListStyle}
        items={targetProduct ? targetProduct.deliveryTimelineProductMaps : []}
        selectionMode={SelectionMode.none}
        columns={_customerColumns}
      />
    </div>
  );
};

export default DeliveriesList;
