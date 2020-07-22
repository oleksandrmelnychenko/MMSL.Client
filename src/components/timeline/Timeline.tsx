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
  CommonDialogType,
} from '../../redux/slices/control.slice';
import { deliveryTimelinesActions } from '../../redux/slices/deliveryTimeline.slice';
import {
  scrollablePaneStyleForDetailList,
  detailsListStyle,
  columnIconButtonStyle,
  cellStyle,
  horizontalGapStackTokens,
  mainTitleContent,
} from '../../common/fabric-styles/styles';
import TimelineForm from './TimelineForm';
import { DeliveryTimeline } from '../../interfaces/deliveryTimelines';

export const Timeline: React.FC = () => {
  const dispatch = useDispatch();

  const selectedDeliveryTimeline = useSelector<
    IApplicationState,
    DeliveryTimeline | null
  >((state) => state.deliveryTimelines.selectedDeliveryTimeline);

  const _customerColumns: IColumn[] = [
    {
      key: 'name',
      name: '',
      minWidth: 16,
      maxWidth: 200,

      onRender: (item: any, index?: number) => {
        return <Text style={cellStyle}>{item.name}</Text>;
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
                  deliveryTimelinesActions.selectedDeliveryTimeLine(item.id)
                );
                dispatch(
                  controlActions.openRightPanel({
                    title: 'Edit timeline',
                    description: selectedDeliveryTimeline
                      ? selectedDeliveryTimeline.name
                      : null,
                    width: '400px',
                    closeFunctions: () => {
                      dispatch(controlActions.closeRightPanel());
                    },
                    component: TimelineForm,
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
                    subText: `Are you sure you want to delete ${item.name}?`,
                    onSubmitClick: () => {
                      dispatch(
                        deliveryTimelinesActions.apiDeleteDeliveryTimeline(
                          item.id
                        )
                      );
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

  const shimmer = useSelector<IApplicationState, boolean>(
    (state) => state.control.isGlobalShimmerActive
  );

  const deliveryTimelines = useSelector<IApplicationState, DeliveryTimeline[]>(
    (state) => state.deliveryTimelines.deliveryTimelines
  );

  useEffect(() => {
    dispatch(controlActions.showGlobalShimmer());
    dispatch(deliveryTimelinesActions.apiGetAllDeliveryTimeline());
    return () => {
      dispatch(deliveryTimelinesActions.clearAllDeliveryTimelines());
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
                tokens={horizontalGapStackTokens}
              >
                <Text variant="xLarge" nowrap block styles={mainTitleContent}>
                  Delivery timeline
                </Text>
                <ActionButton
                  onClick={() => {
                    dispatch(
                      controlActions.openRightPanel({
                        title: 'New timeline',
                        width: '400px',
                        closeFunctions: () => {
                          dispatch(controlActions.closeRightPanel());
                        },
                        component: TimelineForm,
                      })
                    );
                  }}
                  iconProps={{ iconName: 'Add' }}
                >
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
    </div>
  );
};

export default Timeline;
