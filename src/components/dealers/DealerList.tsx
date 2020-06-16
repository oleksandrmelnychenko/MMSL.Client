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
  IRenderFunction,
  IDetailsHeaderProps,
  IDetailsColumnRenderTooltipProps,
  TooltipHost,
  DetailsList,
  IDetailsRowProps,
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
import { PaginationInfo, Pagination } from '../../interfaces';
import { List } from 'linq-typescript';
import { dealerAccountActions } from '../../redux/slices/dealerAccount.slice';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

export const DealerList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection({}));
  const [handlingNull, setHandlingNull] = useState<boolean>(false);

  const selectedDealerId: number | null | undefined = useSelector<
    IApplicationState,
    number | null | undefined
  >((state) => state.dealer.selectedDealer?.id);

  const dealers: DealerAccount[] = useSelector<
    IApplicationState,
    DealerAccount[]
  >((state) => state.dealerAccount.dealers);

  const pagination: Pagination = useSelector<IApplicationState, Pagination>(
    (state) => state.dealerAccount.pagination
  );

  useEffect(() => {
    requestInfinitDealers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /// Dispose component
  useEffect(() => {
    return () => {
      dispatch(dealerActions.getAndSelectDealerById(null));
      dispatch(controlActions.closeInfoPanelWithComponent());

      dispatch(dealerAccountActions.changePagination(new Pagination()));
      dispatch(dealerAccountActions.changDealersList([]));
      dispatch(dealerAccountActions.resetFilter());

      setHandlingNull(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedDealerId) {
      selection.setAllSelected(false);
    }
  }, [selectedDealerId, selection]);

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

  const onRenderRow = (args: any) => {
    return (
      <div
        onClick={(clickArgs: any) => {
          const offsetParent: any = clickArgs?.target?.offsetParent?.className;

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
        <DetailsRow on {...args} />
      </div>
    );
  };

  const requestInfinitDealers = () => {
    if (!handlingNull) {
      setHandlingNull(true);

      dispatch(
        dealerAccountActions.changePagination({
          ...pagination,
          paginationInfo: {
            ...pagination.paginationInfo,
            pageNumber: pagination.paginationInfo.pageNumber + 1,
          },
        })
      );

      // dispatch()

      dispatch(
        assignPendingActions(
          // dealerAccountActions.apiGetDealersPaginatedPage({
          //   paginationLimit: PAGINATION_LIMIT,
          //   paginationPageNumber: paginationInfo.pageNumber + 1,
          //   searchPhrase: '',
          //   fromDate: undefined,
          //   toDate: undefined,
          // }),
          dealerAccountActions.apiGetDealersPaginatedFlow(),
          [],
          [],
          (args: any) => {
            const incomeEntities: any[] = args.entities;
            const responsePaginationInfo: PaginationInfo = args.paginationInfo;

            let dealersList: any = new List(dealers)
              .where((dealer) => dealer !== null)
              .concat(incomeEntities);

            if (
              responsePaginationInfo.pageNumber <
              responsePaginationInfo.pagesCount
            )
              dealersList = dealersList.concat([null]);

            dispatch(
              dealerAccountActions.changDealersList(dealersList.toArray())
            );
            dispatch(
              dealerAccountActions.changePaginationInfo(responsePaginationInfo)
            );

            // setDealers(dealersList.toArray());
            // setPaginationInfo(incomePaginationInfo);
            setHandlingNull(false);
          },
          (args: any) => {
            debugger;
          }
        )
      );
    }
  };

  const onDeleteDealer = (dealerToDelete: DealerAccount) => {
    if (dealerToDelete) {
      dispatch(
        controlActions.toggleCommonDialogVisibility(
          new DialogArgs(
            CommonDialogType.Delete,
            'Delete dealer',
            `Are you sure you want to delete ${dealerToDelete.name}?`,
            () => {
              dispatch(
                assignPendingActions(
                  dealerAccountActions.apiDeleteDealerById(dealerToDelete.id),
                  [],
                  [],
                  (args: any) => {
                    const dealersList = new List(dealers);
                    const deletedDealer = dealersList.firstOrDefault(
                      (dealer) =>
                        dealer !== null && dealer.id === dealerToDelete.id
                    );

                    if (deletedDealer) {
                      dealersList.remove(deletedDealer);
                      dispatch(
                        dealerAccountActions.changDealersList(
                          dealersList.toArray()
                        )
                      );
                      // setDealers(dealersList.toArray());
                    }

                    if (dealerToDelete.id) {
                      dispatch(dealerActions.setSelectedDealer(null));
                      dispatch(controlActions.closeInfoPanelWithComponent());
                      dispatch(
                        dealerActions.isOpenPanelWithDealerDetails(
                          new ToggleDealerPanelWithDetails()
                        )
                      );
                    }
                  },
                  (args: any) => {}
                )
              );
            },
            () => {}
          )
        )
      );
    }
  };

  const dealerColumns: IColumn[] = [
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
              onClick={(args: any) => onDeleteDealer(item)}
            />
          </Stack>
        );
      },
      isPadded: true,
    },
  ];

  return (
    <ScrollablePane styles={scrollablePaneStyleForDetailList}>
      <DetailsList
        onRenderDetailsHeader={onRenderDetailsHeader}
        styles={detailsListStyle}
        items={dealers}
        selection={selection}
        selectionMode={SelectionMode.single}
        columns={dealerColumns}
        onRenderRow={onRenderRow}
        onRenderMissingItem={(index?: number, rowProps?: IDetailsRowProps) => {
          setTimeout(function () {
            requestInfinitDealers();
          }, 500);

          return 'Wait a lo';
        }}
      />
    </ScrollablePane>
  );
};

export default DealerList;
