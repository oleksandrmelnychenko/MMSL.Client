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
  ActionButton,
  Stack,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../redux/slices/control.slice';
import { productSettingsActions } from '../../redux/slices/productSettings.slice';
import {
  scrollablePaneStyleForDetailList,
  detailsListStyle,
  columnIconButtonStyle,
  firstCellStyle,
  cellStyle,
  horizontalGapStackTokens,
  mainTitleContent,
} from '../../common/fabric-styles/styles';
import TimelinePanel from './TimelinePanel';
import { DeliveryTimeline } from '../../interfaces/index';

export const Timeline: React.FC = () => {
  const dispatch = useDispatch();

  const _customerColumns: IColumn[] = [
    {
      key: 'name',
      name: '',
      minWidth: 16,
      maxWidth: 200,

      onRender: (item: any, index?: number) => {
        return <Text style={firstCellStyle}>{item.name}</Text>;
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
        return <Text style={cellStyle}>{item.ivory}</Text>;
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
        return <Text style={cellStyle}>{item.silver}</Text>;
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
        return <Text style={cellStyle}>{item.black}</Text>;
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
        return <Text style={cellStyle}>{item.gold}</Text>;
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
                dispatch(
                  productSettingsActions.selectedDeliveryTimeLine(item.id)
                );
                dispatch(productSettingsActions.openTimelineFormPanel());
              }}></ActionButton>
            <ActionButton
              styles={columnIconButtonStyle}
              iconProps={{ iconName: 'Delete' }}
              onClick={() => {
                dispatch(
                  controlActions.toggleCommonDialogVisibility(
                    new DialogArgs(
                      CommonDialogType.Delete,
                      'Delete delivery timeline',
                      `Are you sure you want to delete ${item.name}?`,
                      () => {
                        dispatch(
                          productSettingsActions.apiDeleteDeliveryTimeline(
                            item.id
                          )
                        );
                      },
                      () => {}
                    )
                  )
                );
              }}></ActionButton>
          </>
        );
      },
      isPadded: true,
    },
  ];

  const shimmer = useSelector<IApplicationState, boolean>(
    (state) => state.control.isGlobalShimmerActive
  );

  const deliveryTimelines = useSelector<IApplicationState, DeliveryTimeline[]>(
    (state) => state.productSettings.manageTimelineState.deliveryTimelines
  );

  useEffect(() => {
    dispatch(controlActions.showGlobalShimmer());
    dispatch(productSettingsActions.apiGetAllDeliveryTimeline());
    return () => {
      dispatch(productSettingsActions.clearAllDeliveryTimelines());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (deliveryTimelines.length > 0) {
      dispatch(controlActions.hideGlobalShimmer());
    }
  }, [deliveryTimelines, dispatch]);

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

  return (
    <div className="content__root">
      <Stack verticalAlign="space-around">
        <Stack.Item align="stretch">
          <div className="content__header">
            <div className="content__header__top">
              <Stack
                horizontal
                verticalAlign="center"
                tokens={horizontalGapStackTokens}>
                <Text variant="xLarge" nowrap block styles={mainTitleContent}>
                  Delivery timeline
                </Text>
                <ActionButton
                  onClick={() => {
                    dispatch(productSettingsActions.openTimelineFormPanel());
                  }}
                  iconProps={{ iconName: 'Add' }}>
                  New timeline
                </ActionButton>
              </Stack>
            </div>
          </div>
        </Stack.Item>
        <Stack.Item>
          <ScrollablePane styles={scrollablePaneStyleForDetailList}>
            <ShimmeredDetailsList
              onRenderDetailsHeader={onRenderDetailsHeader}
              enableShimmer={shimmer}
              styles={detailsListStyle}
              items={deliveryTimelines}
              selectionMode={SelectionMode.none}
              columns={_customerColumns}
            />
          </ScrollablePane>
        </Stack.Item>
      </Stack>
      <TimelinePanel />
    </div>
  );
};

export default Timeline;
