import React, { useEffect } from 'react';
import {
  IColumn,
  SelectionMode,
  Text,
  ScrollablePane,
  ShimmeredDetailsList,
  IDetailsHeaderProps,
  IRenderFunction,
  TooltipHost,
  Sticky,
  StickyPositionType,
  IDetailsColumnRenderTooltipProps,
  Stack,
  Image,
  Label,
  PrimaryButton,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import NoMeasurementImg from '../../../assets/images/no-objects/noneMeasurement.svg';
import {
  detailsListStyle,
  columnIconButtonStyle,
  cellStyle,
  horizontalGapStackTokens,
  mainTitleContent,
  scrollablePaneStyleForDetailListWithDoubleHeader,
  imageProps,
} from '../../../common/fabric-styles/styles';
import {
  ProductDeliveryTimeline,
  ProductCategory,
} from '../../../interfaces/index';
import { useHistory } from 'react-router-dom';
import { ActionButton } from 'office-ui-fabric-react';
import { IApplicationState } from '../../../redux/reducers/index';
import ProductDeliverTimelineForm from './ProductDeliverTimelineForm';
import { productActions } from '../../../redux/slices/product.slice';
import { ProductDeliveryTimelineSelected } from '../../../interfaces/index';
import { assignPendingActions } from '../../../helpers/action.helper';

export const ProductDeliverTimeline: React.FC = () => {
  const dispatch = useDispatch();

  const category = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  const deleteDeliveryTimeline = (
    timeline: ProductDeliveryTimelineSelected
  ) => {
    let result = new ProductDeliveryTimeline();
    result.productCategoryId = timeline.productCategoryId;
    let deleteTimeline = timeline.deliveryTimeline;
    deleteTimeline.isDeleted = true;
    result.deliveryTimelines.push(deleteTimeline);

    let action = assignPendingActions(
      productActions.assignProductDeliveryTimeline(result),
      [],
      [],
      (args: any) => {
        dispatch(
          assignPendingActions(
            productActions.apiGetProductCategoryById(category?.id),
            [],
            [],
            (args: any) => {
              dispatch(productActions.chooseProductCategory(args));
            },
            (args: any) => {}
          )
        );
      },
      (args: any) => {}
    );

    dispatch(action);
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
                console.log(item);
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
                  controlActions.toggleCommonDialogVisibility(
                    new DialogArgs(
                      CommonDialogType.Delete,
                      'Delete delivery timeline',
                      `Are you sure you want to delete ${item.deliveryTimeline.name}?`,
                      () => {
                        deleteDeliveryTimeline(item);
                      },
                      () => {}
                    )
                  )
                );
              }}
            ></ActionButton>
          </>
        );
      },
      isPadded: true,
    },
  ];

  const shimmer = useSelector<IApplicationState, boolean>(
    (state) => state.control.isGlobalShimmerActive
  );

  const createNewTimeline = () => {
    dispatch(productActions.selectedTimeline(null));
    dispatch(
      controlActions.openRightPanel({
        title: 'New timeline',
        width: '400px',
        closeFunctions: () => {
          dispatch(controlActions.closeRightPanel());
        },
        component: ProductDeliverTimelineForm,
      })
    );
  };

  useEffect(() => {
    dispatch(controlActions.showGlobalShimmer());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      category &&
      category.deliveryTimelineProductMaps &&
      category.deliveryTimelineProductMaps.length > 0
    ) {
      dispatch(controlActions.hideGlobalShimmer());
    }
  }, [category?.deliveryTimelineProductMaps]);

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

  const hintContentHideableStyle = category?.deliveryTimelineProductMaps
    ? { height: '100%' }
    : { display: 'none' };

  const history = useHistory();

  return (
    <div className="content__root">
      <Stack verticalAlign="space-around">
        <Stack.Item align="stretch">
          <div className="content__header">
            {/* Old pattern */}
            {/* <div className="content__header__top">
              <ActionButton
                onClick={() => history.goBack()}
                iconProps={{ iconName: 'Back' }}>
                Back to products
              </ActionButton>
            </div> */}
            {category?.deliveryTimelineProductMaps &&
            category.deliveryTimelineProductMaps.length > 0 ? (
              <div className="content__header__top">
                <Stack
                  horizontal
                  verticalAlign="center"
                  tokens={horizontalGapStackTokens}
                >
                  <Text variant="xLarge" nowrap block styles={mainTitleContent}>
                    Delivery timeline
                  </Text>
                  {/* Old pattern */}
                  {/* <ActionButton
                    onClick={createNewTimeline}
                    iconProps={{ iconName: 'Add' }}
                  >
                    New timeline
                  </ActionButton> */}
                </Stack>
              </div>
            ) : null}
          </div>
        </Stack.Item>
        {category?.deliveryTimelineProductMaps &&
        category.deliveryTimelineProductMaps.length > 0 ? (
          <Stack.Item>
            <ScrollablePane
              styles={scrollablePaneStyleForDetailListWithDoubleHeader}
            >
              <ShimmeredDetailsList
                onRenderDetailsHeader={onRenderDetailsHeader}
                enableShimmer={shimmer}
                styles={detailsListStyle}
                items={category?.deliveryTimelineProductMaps}
                selectionMode={SelectionMode.none}
                columns={_customerColumns}
              />
            </ScrollablePane>
          </Stack.Item>
        ) : (
          <div style={hintContentHideableStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '70vh',
              }}
            >
              <Stack>
                <Image {...imageProps} src={NoMeasurementImg} />
                <Label
                  styles={{
                    root: {
                      color: '#484848',
                      fontSize: '18px',
                    },
                  }}
                >
                  Create your first timeline for the product
                </Label>
                <Stack.Item align={'center'}>
                  <PrimaryButton
                    text={'Create timeline'}
                    onClick={createNewTimeline}
                  />
                </Stack.Item>
              </Stack>
            </div>
          </div>
        )}
      </Stack>
    </div>
  );
};

export default ProductDeliverTimeline;
