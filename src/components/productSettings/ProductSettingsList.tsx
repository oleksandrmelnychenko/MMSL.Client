import React, { useEffect, useState } from 'react';
import './productSettingsLsit.scss';
import {
  DetailsList,
  IColumn,
  Text,
  Selection,
  Image,
  Stack,
  IconButton,
  MarqueeSelection,
  DetailsHeader,
  DetailsRow,
  CheckboxVisibility,
  GroupHeader,
  ITextProps,
  IImageProps,
  ImageFit,
  ScrollablePane,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { OptionGroup } from '../../interfaces';
import { assignPendingActions } from '../../helpers/action.helper';
import * as productSettingsActions from '../../redux/actions/productSettings.actions';
import { ManagingPanelComponent } from '../../redux/reducers/productSettings.reducer';
import { List } from 'linq-typescript';
import { scrollablePaneStyleForDetailList } from '../../common/fabric-styles/styles';
import { DATA_SELECTION_DISABLED_CLASS } from '../dealers/DealerList';

const _columnIconButtonStyle = {
  root: {
    height: '20px',
    marginTop: '15px',
  },
};

export const ProductSettingsList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection());

  const outionGroups: OptionGroup[] = useSelector<
    IApplicationState,
    OptionGroup[]
  >((state) => state.productSettings.optionGroupsList);

  useEffect(() => {
    dispatch(productSettingsActions.getAllOptionGroupsList());
  }, [dispatch]);

  const customerColumns: IColumn[] = [
    {
      key: 'index',
      name: '#',
      minWidth: 16,
      maxWidth: 200,
      onColumnClick: () => {},
      onRender: (item: any, index?: number) => {
        const imageProps: IImageProps = {
          src: item.imageUrl,
          imageFit: ImageFit.center,
          width: 67,
          height: 53,
        };

        return (
          <Stack horizontal tokens={{ childrenGap: 20 }}>
            {item.imageUrl && item.imageUrl.length > 0 ? (
              <Stack.Item>
                <Image {...imageProps} alt={`${item.value}`} />
              </Stack.Item>
            ) : null}

            <Stack>
              <Stack.Item>
                <Text
                  variant={'mediumPlus' as ITextProps['variant']}
                  styles={{ root: { color: '#484848', fontWeight: 400 } }}
                >
                  {item.value}
                </Text>
              </Stack.Item>
              <Stack.Item>
                <Text styles={{ root: { color: '#7b7b7b' } }}>
                  {item.isMandatory ? 'Allowed' : 'Not allowed'}
                </Text>
              </Stack.Item>
            </Stack>
          </Stack>
        );
      },
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
              styles={_columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'SingleColumnEdit' }}
              title="Delete"
              ariaLabel="Delete"
              onClick={(args: any) => {
                // dispatch(
                //   controlAction.toggleCommonDialogVisibility(
                //     new DialogArgs(
                //       CommonDialogType.Delete,
                //       'Delete dealer',
                //       `Are you sure you want to delete ${item.name}?`,
                //       () => {
                //         const actionsQueue: any[] = [
                //           dealerActions.getDealersListPaginated(),
                //         ];
                //         /// TODO:
                //         if (item.id) {
                //           actionsQueue.push(
                //             dealerActions.setSelectedDealer(null),
                //             controlAction.closeInfoPanelWithComponent(),
                //             dealerActions.isOpenPanelWithDealerDetails(
                //               new ToggleDealerPanelWithDetails()
                //             )
                //           );
                //         }
                //         let action = assignPendingActions(
                //           dealerActions.deleteDealerById(item.id),
                //           actionsQueue
                //         );
                //         dispatch(action);
                //       },
                //       () => {}
                //     )
                //   )
                // );
              }}
            />
            <IconButton
              data-selection-disabled={true}
              className={DATA_SELECTION_DISABLED_CLASS}
              styles={_columnIconButtonStyle}
              height={20}
              iconProps={{ iconName: 'Delete' }}
              title="Delete"
              ariaLabel="Delete"
              onClick={(args: any) => {
                // dispatch(
                //   controlAction.toggleCommonDialogVisibility(
                //     new DialogArgs(
                //       CommonDialogType.Delete,
                //       'Delete dealer',
                //       `Are you sure you want to delete ${item.name}?`,
                //       () => {
                //         const actionsQueue: any[] = [
                //           dealerActions.getDealersListPaginated(),
                //         ];
                //         /// TODO:
                //         if (item.id) {
                //           actionsQueue.push(
                //             dealerActions.setSelectedDealer(null),
                //             controlAction.closeInfoPanelWithComponent(),
                //             dealerActions.isOpenPanelWithDealerDetails(
                //               new ToggleDealerPanelWithDetails()
                //             )
                //           );
                //         }
                //         let action = assignPendingActions(
                //           dealerActions.deleteDealerById(item.id),
                //           actionsQueue
                //         );
                //         dispatch(action);
                //       },
                //       () => {}
                //     )
                //   )
                // );
              }}
            />
          </Stack>
        );
      },
      isPadded: true,
    },
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
        // isDropEnabled: group.optionUnits.length > 0,
        isDropEnabled: false,
        isCollapsed: false,
      };

      groupIndex += group.optionUnits.length;

      return groupEntity;
    })
    .toArray();

  return (
    <div className="productSettingsLsit">
      <ScrollablePane styles={scrollablePaneStyleForDetailList}>
        <DetailsList
          selection={selection}
          groupProps={{
            showEmptyGroups: true,
            onRenderHeader: (props?: any, defaultRender?: any) => {
              return (
                <GroupHeader
                  styles={{
                    root: { overflowY: 'scroll' },
                    check: { display: 'none' },
                    headerCount: { display: 'none' },
                    expandButtonProps: { display: 'none' },
                    expandButtonIcon: 'Edit',
                  }}
                  {...props}
                  onRenderTitle={(props?: any, defaultRender?: any) => {
                    return (
                      <div
                        style={{
                          paddingLeft: '8px',
                          paddingRight: '8px',
                          width: '100%',
                        }}
                      >
                        <Stack
                          horizontal
                          horizontalAlign="space-between"
                          tokens={{ childrenGap: 0 }}
                        >
                          {defaultRender(props)}

                          <IconButton
                            styles={{
                              root: {
                                height: '20px',
                                marginRight: '15px',
                              },
                            }}
                            height={20}
                            iconProps={{ iconName: 'ColumnRightTwoThirdsEdit' }}
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
      </ScrollablePane>
    </div>
  );
};

export default ProductSettingsList;
