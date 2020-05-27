import './dealerList.scss';
import React, { useEffect, useState } from 'react';
import {
  IColumn,
  SelectionMode,
  Text,
  Selection,
  Stack,
  IconButton,
  DetailsRow,
  ScrollablePane,
  ShimmeredDetailsList,
  IRenderFunction,
  IDetailsHeaderProps,
  IDetailsColumnRenderTooltipProps,
  TooltipHost,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { dealerActions } from '../../redux/slices/dealer.slice';
import { DealerAccount } from '../../interfaces';
import { assignPendingActions } from '../../helpers/action.helper';
import { controlActions } from '../../redux/slices/control.slice';
import { ToggleDealerPanelWithDetails } from '../../redux/slices/dealer.slice';
import ManagementOptions from './dealerManaging/ManagementOptions';
import { DialogArgs, CommonDialogType } from '../../redux/slices/control.slice';
import {
  detailsListStyle,
  scrollablePaneStyleForDetailList_Dealers,
  columnIconButtonStyle,
} from '../../common/fabric-styles/styles';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

export const DealerList: React.FC = () => {
  const dispatch = useDispatch();
  const dealers: DealerAccount[] = useSelector<
    IApplicationState,
    DealerAccount[]
  >((state) => state.dealer.dealerState.dealersList);

  const [selection] = useState(new Selection({}));

  const selectedDealerId: number | null | undefined = useSelector<
    IApplicationState,
    number | null | undefined
  >((state) => state.dealer.selectedDealer?.id);

  const shimmer = useSelector<IApplicationState, boolean>(
    (state) => state.control.isGlobalShimmerActive
  );

  useEffect(() => {
    if (!selectedDealerId) {
      selection.setAllSelected(false);
    }
  }, [selectedDealerId, selection]);

  useEffect(() => {
    dispatch(dealerActions.getDealersListPaginated());
    dispatch(controlActions.showGlobalShimmer());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dealers.length > 0 && shimmer) {
      dispatch(controlActions.hideGlobalShimmer());
    }
  }, [dealers, dispatch, shimmer]);

  const _dealerColumns: IColumn[] = [
    {
      key: 'index',
      name: '#',
      minWidth: 16,
      maxWidth: 24,
      onColumnClick: () => {},
      onRender: (item: any, index?: number) => {
        return (
          <Text>{index !== null && index !== undefined ? index + 1 : -1}</Text>
        );
      },
    },
    {
      key: 'name',
      name: 'Name',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.name}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'email',
      name: 'Email',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.email}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'company',
      name: 'Company',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text>{item.companyName}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 70,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return (
          <Stack horizontal disableShrink>
            <IconButton
              data-selection-disabled={true}
              className={DATA_SELECTION_DISABLED_CLASS}
              styles={columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'Delete' }}
              title="Delete"
              ariaLabel="Delete"
              onClick={(args: any) => {
                dispatch(
                  controlActions.toggleCommonDialogVisibility(
                    new DialogArgs(
                      CommonDialogType.Delete,
                      'Delete dealer',
                      `Are you sure you want to delete ${item.name}?`,
                      () => {
                        const actionsQueue: any[] = [
                          dealerActions.getDealersListPaginated(),
                        ];
                        /// TODO:
                        if (item.id) {
                          actionsQueue.push(
                            dealerActions.setSelectedDealer(null),
                            controlActions.closeInfoPanelWithComponent(),
                            dealerActions.isOpenPanelWithDealerDetails(
                              new ToggleDealerPanelWithDetails()
                            )
                          );
                        }
                        let action = assignPendingActions(
                          dealerActions.deleteDealerById(item.id),
                          actionsQueue
                        );
                        dispatch(action);
                      },
                      () => {}
                    )
                  )
                );
              }}
            />
          </Stack>
        );
      },
      isPadded: true,
    },
  ];

  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
    props,
    defaultRender
  ) => {
    if (!props) {
      return null;
    }
    const onRenderColumnHeaderTooltip: IRenderFunction<IDetailsColumnRenderTooltipProps> = (
      tooltipHostProps
    ) => <TooltipHost {...tooltipHostProps} />;
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
    <div className="dealerList">
      <ScrollablePane styles={scrollablePaneStyleForDetailList_Dealers}>
        <ShimmeredDetailsList
          onRenderDetailsHeader={onRenderDetailsHeader}
          enableShimmer={shimmer}
          styles={detailsListStyle}
          items={dealers}
          selection={selection}
          selectionMode={SelectionMode.single}
          columns={_dealerColumns}
          onRenderRow={(args: any) => {
            return (
              <div
                onClick={(clickArgs: any) => {
                  const offsetParent: any =
                    clickArgs?.target?.offsetParent?.className;

                  if (!offsetParent.includes(DATA_SELECTION_DISABLED_CLASS)) {
                    const selectFlow = () => {
                      let createAction = assignPendingActions(
                        dealerActions.getAndSelectDealerById(args.item.id),
                        []
                      );
                      dispatch(createAction);
                      dispatch(
                        controlActions.openInfoPanelWithComponent(
                          ManagementOptions
                        )
                      );
                    };

                    const unSelectFlow = () => {
                      dispatch(dealerActions.setSelectedDealer(null));
                      dispatch(controlActions.closeInfoPanelWithComponent());
                    };

                    if (selectedDealerId) {
                      if (selectedDealerId === args.item.id) {
                        unSelectFlow();
                      } else {
                        selectFlow();
                      }
                    } else {
                      selectFlow();
                    }
                  }
                }}>
                <DetailsRow {...args} />
              </div>
            );
          }}
        />
      </ScrollablePane>
    </div>
  );
};

export default DealerList;
