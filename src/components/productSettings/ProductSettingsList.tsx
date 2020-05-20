import React, { useEffect, useState, Children } from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Text,
  Selection,
  Stack,
  IconButton,
  MarqueeSelection,
  IDetailsHeaderProps,
  IRenderFunction,
  DetailsHeader,
  DetailsRow,
  IDetailsGroupDividerProps,
  CheckboxVisibility,
  GroupHeader,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import * as customerActions from '../../redux/actions/customer.actions';
import * as controlActions from '../../redux/actions/control.actions';
import {
  DealerAccount,
  Pagination,
  StoreCustomer,
  OptionGroup,
} from '../../interfaces';
import { assignPendingActions } from '../../helpers/action.helper';
import * as productSettingsActions from '../../redux/actions/productSettings.actions';
import { ManagingPanelComponent } from '../../redux/reducers/productSettings.reducer';
import { List } from 'linq-typescript';

const _columnIconButtonStyle = {
  root: {
    height: '20px',
  },
};

export const ProductSettingsList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(
    new Selection({
      onSelectionChanged: () => {
        /// TODO: important
        // if (selection.count > 0) {
        //   dealerSelection();
        // } else {
        //   dealerUnSelection();
        // }
      },
    })
  );

  const outionGroups: OptionGroup[] = useSelector<
    IApplicationState,
    OptionGroup[]
  >((state) => state.productSettings.optionGroupsList);

  useEffect(() => {
    dispatch(productSettingsActions.getAllOptionGroupsList());
  }, [dispatch]);

  /// TODO: important
  //   const pagination: Pagination = useSelector<IApplicationState, Pagination>(
  //     (state) => state.dealer.dealerState.pagination
  //   );

  /// TODO: important
  //   const selectedDealer: any = useSelector<
  //     IApplicationState,
  //     DealerAccount | null
  //   >((state) => state.dealer.selectedDealer);

  /// TODO: important
  //   const isCollapseMenu: boolean = useSelector<IApplicationState, boolean>(
  //     (state) => state.control.isCollapseMenu
  //   );

  /// TODO: important
  //   useEffect(() => {
  //     if (!isCollapseMenu) {
  //       selection.setAllSelected(false);
  //     }
  //   }, [isCollapseMenu, selection]);

  /// TODO: important
  //   const dealerSelection = () => {
  //     const selectedDealer = selection.getSelection()[0] as DealerAccount;

  //     let createAction = assignPendingActions(
  //       dealerActions.getAndSelectDealerById(selectedDealer.id),
  //       []
  //     );
  //     dispatch(controlActions.isCollapseMenu(true));
  //     setTimeout(() => {
  //       dispatch(controlActions.isOpenPanelInfo(true));
  //     }, 350);

  //     dispatch(createAction);
  //   };

  /// TODO: important
  //   const dealerUnSelection = () => {
  //     dispatch(dealerActions.setSelectedDealer(null));
  //     dispatch(controlActions.isCollapseMenu(false));
  //     dispatch(controlActions.isOpenPanelInfo(false));
  //   };

  const customerColumns: IColumn[] = [
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
    // {
    //   key: 'name',
    //   name: 'Name',
    //   minWidth: 70,
    //   maxWidth: 90,
    //   isResizable: true,
    //   isCollapsible: true,
    //   data: 'string',
    //   onRender: (item: any) => {
    //     return <Text>{item.name}</Text>;
    //   },
    //   isPadded: true,
    // },
    // {
    //   key: 'actions',
    //   name: 'Actions',
    //   minWidth: 70,
    //   isResizable: true,
    //   isCollapsible: true,
    //   data: 'string',
    //   onRender: (item: any) => {
    //     return (
    //       <Stack horizontal disableShrink>
    //         <IconButton
    //           styles={_columnIconButtonStyle}
    //           height={20}
    //           iconProps={{ iconName: 'Settings' }}
    //           title="Settings"
    //           ariaLabel="Settings"
    //           onClick={() => {
    //             dispatch(
    //               productSettingsActions.changeTargetOptionGroupForUnitsEdit(
    //                 item
    //               )
    //             );
    //             dispatch(
    //               productSettingsActions.managingPanelContent(
    //                 ManagingPanelComponent.ManageUnits
    //               )
    //             );
    //           }}
    //         />
    //       </Stack>
    //     );
    //   },
    //   isPadded: true,
    // },
  ];

  const allConcatedUnits = new List(outionGroups)
    .selectMany((group) => group.optionUnits)
    .toArray();

  let groupIndex: number = 0;
  const groups = new List(outionGroups)
    .select((group) => {
      const groupEntity = {
        key: `${group.id}`,
        name: group.name,
        level: 0,
        startIndex: groupIndex,
        count: group.optionUnits.length,
        isDropEnabled: group.optionUnits.length > 0,
      };

      groupIndex += group.optionUnits.length;

      return groupEntity;
    })
    .toArray();

  return (
    <div className="customerList">
      <MarqueeSelection selection={selection}>
        <DetailsList
          groupProps={{
            showEmptyGroups: true,
            onRenderHeader: (props?: any, defaultRender?: any) => {
              const headerCountStyle = { display: 'none' };
              const checkButtonStyle = { display: 'none' };

              return (
                <GroupHeader
                  onRenderTitle={(props?: any, defaultRender?: any) => {
                    return (
                      <div>
                        <Stack horizontal tokens={{ childrenGap: 20 }}>
                          {defaultRender(props)}
                          <IconButton
                            styles={_columnIconButtonStyle}
                            height={20}
                            iconProps={{ iconName: 'Edit' }}
                            title="Settings"
                            ariaLabel="Settings"
                            onClick={() => {
                              let action = assignPendingActions(
                                productSettingsActions.getAndSelectOptionGroupById(
                                  parseInt(props.group.key)
                                ),
                                [
                                  productSettingsActions.managingPanelContent(
                                    ManagingPanelComponent.ManageUnits
                                  ),
                                ]
                              );
                              dispatch(action);
                            }}
                          />
                        </Stack>
                      </div>
                    );
                  }}
                  styles={{
                    check: checkButtonStyle,
                    headerCount: headerCountStyle,
                  }}
                  {...props}
                />
              );
            },
          }}
          groups={groups}
          isHeaderVisible={false}
          columns={customerColumns}
          items={allConcatedUnits}
          checkboxVisibility={CheckboxVisibility.hidden}
          onRenderRow={(args: any) => {
            return (
              <div>
                <DetailsRow {...args} />
              </div>
            );
          }}
          onRenderDetailsHeader={(props: any, _defaultRender?: any) => {
            return (
              <DetailsHeader
                {...props}
                ariaLabelForToggleAllGroupsButton={'Expand collapse groups'}
              />
            );
          }}
        />
      </MarqueeSelection>
    </div>
  );
};

export default ProductSettingsList;
