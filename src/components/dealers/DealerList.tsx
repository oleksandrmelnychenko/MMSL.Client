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
  FontIcon,
  mergeStyles,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { dealerActions } from '../../redux/slices/dealer.slice';
import { DealerAccount } from '../../interfaces/dealer';
import { assignPendingActions } from '../../helpers/action.helper';
import { controlActions } from '../../redux/slices/control.slice';
import { ToggleDealerPanelWithDetails } from '../../redux/slices/dealer.slice';
import ManagementOptions from './dealerManaging/ManagementOptions';
import { DialogArgs, CommonDialogType } from '../../redux/slices/control.slice';
import {
  detailsListStyle,
  columnIconButtonStyle,
  defaultCellStyle,
  scrollablePaneStyleForDetailList,
} from '../../common/fabric-styles/styles';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';
const USED_OWN_PASSWORD: string = 'Own password used';
const USED_OWN_PASSWORD_COLOR_HEX: string = '#a4373a80';

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
    dispatch(dealerActions.apiGetDealersListPaginated());
    dispatch(controlActions.showGlobalShimmer());
    return () => {
      dispatch(dealerActions.getAndSelectDealerById(null));
      dispatch(controlActions.closeInfoPanelWithComponent());
    };
  }, [dispatch]);

  useEffect(() => {
    if (dealers.length > 0 && shimmer) {
      dispatch(controlActions.hideGlobalShimmer());
    }
  }, [dealers, dispatch, shimmer]);

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

  const _dealerColumns: IColumn[] = [
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
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        return <Text style={defaultCellStyle}>{item.name}</Text>;
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
        return <Text style={defaultCellStyle}>{item.email}</Text>;
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
        return <Text style={defaultCellStyle}>{item.companyName}</Text>;
      },
      isPadded: true,
    },
    {
      key: 'tempPassword',
      name: 'Temporay Password',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'string',
      onRender: (item: any) => {
        let cellContent =
          item && item.tempPassword ? (
            item.tempPassword.length > 0 ? (
              <Text style={{ ...defaultCellStyle }} block nowrap>
                {item.tempPassword}
              </Text>
            ) : (
              <Stack horizontal>
                <FontIcon
                  style={{
                    cursor: 'default',
                    lineHeight: 1,
                    marginTop: '2px',
                    marginLeft: '-4px',
                  }}
                  iconName="RadioBullet"
                  className={mergeStyles({
                    fontSize: 16,
                    color: USED_OWN_PASSWORD_COLOR_HEX,
                  })}
                />

                <Text block nowrap>
                  {USED_OWN_PASSWORD}
                </Text>
              </Stack>
            )
          ) : (
            ''
          );

        return cellContent;
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
                          dealerActions.apiGetDealersListPaginated(),
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

  return (
    <ScrollablePane styles={scrollablePaneStyleForDetailList}>
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
                      controlActions.openInfoPanelWithComponent({
                        component: ManagementOptions,
                        onDismisPendingAction: () => {},
                      })
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
              }}
            >
              <DetailsRow {...args} />
            </div>
          );
        }}
      />
    </ScrollablePane>
  );
};

export default DealerList;
