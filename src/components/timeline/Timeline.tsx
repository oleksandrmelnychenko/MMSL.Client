import React, { useEffect, useState } from 'react';
import {
  IColumn,
  SelectionMode,
  Text,
  Selection,
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
import { customerActions } from '../../redux/slices/customer.slice';
import { controlActions } from '../../redux/slices/control.slice';
// import ManagementPanel from './options/ManagmentPanel';
import { CustomerListState } from '../../redux/slices/customer.slice';
import {
  scrollablePaneStyleForDetailList,
  detailsListStyle,
} from '../../common/fabric-styles/styles';

const cellStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
};

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
          <ActionButton iconProps={{ iconName: 'Edit' }}></ActionButton>
          <ActionButton iconProps={{ iconName: 'Delete' }}></ActionButton>
        </>
      );
    },
    isPadded: true,
  },
];

export const Timeline: React.FC = () => {
  const dispatch = useDispatch();

  const shimmer = useSelector<IApplicationState, boolean>(
    (state) => state.control.isGlobalShimmerActive
  );

  useEffect(() => {
    dispatch(controlActions.showGlobalShimmer());

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const timelineItems = [
    {
      name: 'Normal Delivery',
      ivory: 30,
      silver: 30,
      black: 45,
      gold: 45,
    },
    {
      name: 'Priority',
      ivory: 21,
      silver: 21,
      black: 30,
      gold: 30,
    },
    {
      name: 'Out of Stock',
      ivory: 14,
      silver: 14,
      black: 14,
      gold: 14,
    },
    {
      name: 'Cut Length Fabric',
      ivory: 14,
      silver: 14,
      black: 14,
      gold: 14,
    },
  ];

  return (
    <div className="content">
      <div className="content__root">
        <Stack verticalAlign="space-around">
          <Stack.Item align="stretch">
            <div className="content__header">
              <div className="content__header__top">
                <Stack horizontal>
                  <div className="content__header__top__title">Timeline</div>
                  <div className="content__header__top__controls">
                    <Stack horizontal tokens={{ childrenGap: 10 }}>
                      <div className="content__header__top__controls__control">
                        <ActionButton
                          onClick={() => {}}
                          iconProps={{ iconName: 'Add' }}>
                          New timeline
                        </ActionButton>
                      </div>
                    </Stack>
                  </div>
                </Stack>
              </div>
            </div>
          </Stack.Item>
          <Stack.Item>
            <ScrollablePane styles={scrollablePaneStyleForDetailList}>
              <ShimmeredDetailsList
                onRenderDetailsHeader={onRenderDetailsHeader}
                enableShimmer={false}
                styles={detailsListStyle}
                items={timelineItems}
                //   selection={selection}
                selectionMode={SelectionMode.none}
                columns={_customerColumns}
              />
            </ScrollablePane>
          </Stack.Item>
        </Stack>
      </div>
    </div>
  );
};

export default Timeline;
