import React, { useEffect, useState } from 'react';
import './productSettingsLsit.scss';
import {
  DetailsList,
  IColumn,
  Selection,
  Stack,
  IconButton,
  CheckboxVisibility,
  GroupHeader,
  ScrollablePane,
  DetailsRow,
  FontIcon,
  mergeStyles,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  IGroup,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { OptionGroup, OptionUnit } from '../../interfaces';
import { assignPendingActions } from '../../helpers/action.helper';
import { productSettingsActions } from '../../redux/slices/productSettings.slice';
import { ManagingPanelComponent } from '../../redux/slices/productSettings.slice';
import { List } from 'linq-typescript';
import { scrollablePaneStyleForDetailList } from '../../common/fabric-styles/styles';
import { DATA_SELECTION_DISABLED_CLASS } from '../dealers/DealerList';
import UnitRowItem from './UnitRowItem';
import { controlActions } from '../../redux/slices/control.slice';
import { DialogArgs, CommonDialogType } from '../../redux/slices/control.slice';

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

  const singleOptionForEdit: OptionUnit | null | undefined = useSelector<
    IApplicationState,
    OptionUnit | null | undefined
  >((state) => state.productSettings.manageSingleOptionUnitState.optionUnit);

  useEffect(() => {
    let action = assignPendingActions(
      productSettingsActions.getAllOptionGroupsList(),
      [],
      [],
      (args: any) => {
        dispatch(productSettingsActions.updateOptionGroupList(args));
      },
      (args: any) => {}
    );

    dispatch(action);
  }, [dispatch]);

  useEffect(() => {
    const panelContentType = singleOptionForEdit
      ? ManagingPanelComponent.ManageSingleOptionUnit
      : null;

    dispatch(productSettingsActions.managingPanelContent(panelContentType));
  }, [singleOptionForEdit, dispatch]);

  const customerColumns: IColumn[] = [
    {
      key: 'index',
      name: '#',
      minWidth: 16,
      maxWidth: 200,
      onColumnClick: () => {},
      onRender: (item: any, index?: number) => {
        return <UnitRowItem optionUnit={item as OptionUnit} />;
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
              iconProps={{ iconName: 'Edit' }}
              title="Edit"
              ariaLabel="Edit"
              onClick={() => {
                dispatch(
                  productSettingsActions.getAndSelectOptionUnitForSingleEditById(
                    item.id
                  )
                );
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
                dispatch(
                  controlActions.toggleCommonDialogVisibility(
                    new DialogArgs(
                      CommonDialogType.Delete,
                      'Delete option unit',
                      `Are you sure you want to delete ${item.value}?`,
                      () => {
                        let action = assignPendingActions(
                          productSettingsActions.deleteOptionUnitById(item.id),
                          [],
                          [],
                          (args: any) => {
                            let action = assignPendingActions(
                              productSettingsActions.getAllOptionGroupsList(),
                              [],
                              [],
                              (args: any) => {
                                dispatch(
                                  productSettingsActions.updateOptionGroupList(
                                    args
                                  )
                                );
                              }
                            );
                            dispatch(action);
                          }
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
        isDropEnabled: false,
        isCollapsed: group.groupItemVisualState.isCollapsed,
        rawGroupModel: group,
      };

      groupIndex += group.optionUnits.length;

      return groupEntity;
    })
    .toArray();

  return (
    <div className="productSettingsLsit">
      <ScrollablePane styles={scrollablePaneStyleForDetailList}>
        <DetailsList
          styles={{ root: { overflowX: 'hidden' } }}
          selection={selection}
          groupProps={{
            headerProps: {
              onToggleCollapse: (group: IGroup) => {
                if ((group as any)?.rawGroupModel?.groupItemVisualState) {
                  (group as any).rawGroupModel.groupItemVisualState.isCollapsed = !group.isCollapsed;
                }
              },
            },
            showEmptyGroups: true,

            onRenderHeader: (props?: any, defaultRender?: any) => {
              return (
                <GroupHeader
                  styles={{
                    root: { marginLeft: '18px', height: '40px' },
                    groupHeaderContainer: { height: '40px' },
                    check: { display: 'none' },
                    headerCount: { display: 'none' },
                    expand: { height: '38px', marginTop: '-2px' },
                  }}
                  {...props}
                  onRenderTitle={(props?: any, defaultRender?: any) => {
                    let mandatoryColor = props.group?.rawGroupModel?.isMandatory
                      ? '#2b579a'
                      : '#2b579a60';

                    return (
                      <div
                        style={{
                          paddingLeft: '0px',
                          paddingRight: '8px',
                          width: '100%',
                        }}>
                        <Stack
                          horizontal
                          horizontalAlign="space-between"
                          tokens={{ childrenGap: 0 }}>
                          <Stack horizontal tokens={{ childrenGap: 10 }}>
                            {defaultRender(props)}{' '}
                            <TooltipHost
                              id={`mandatoryTooltip_${props.group.key}`}
                              calloutProps={{ gapSpace: 0 }}
                              delay={TooltipDelay.zero}
                              directionalHint={DirectionalHint.bottomCenter}
                              styles={{ root: { display: 'inline-block' } }}
                              content={
                                props.group?.rawGroupModel?.isMandatory
                                  ? 'Mandatory'
                                  : 'Not mandatory'
                              }>
                              <FontIcon
                                iconName="Warning"
                                className={mergeStyles({
                                  fontSize: 16,
                                  color: mandatoryColor,
                                })}
                              />
                            </TooltipHost>
                          </Stack>

                          <Stack horizontal tokens={{ childrenGap: 10 }}>
                            <IconButton
                              styles={{
                                root: {
                                  height: '20px',
                                },
                              }}
                              height={20}
                              iconProps={{
                                iconName: 'Settings',
                              }}
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

                            <IconButton
                              styles={{
                                root: {
                                  height: '20px',
                                },
                              }}
                              height={20}
                              iconProps={{
                                iconName: 'Edit',
                              }}
                              title="Edit"
                              ariaLabel="Edit"
                              onClick={() => {
                                let action = assignPendingActions(
                                  productSettingsActions.getAndSelectOptionGroupForSingleEditById(
                                    props.group.key
                                  ),
                                  [],
                                  [],
                                  (args: any) => {
                                    dispatch(
                                      productSettingsActions.updateTargetSingleEditOptionGroup(
                                        args
                                      )
                                    );
                                    dispatch(
                                      productSettingsActions.managingPanelContent(
                                        ManagingPanelComponent.ManageSingleOptionGroup
                                      )
                                    );
                                  }
                                );
                                dispatch(action);
                              }}
                            />

                            <IconButton
                              styles={{
                                root: {
                                  height: '20px',
                                  marginRight: '90px',
                                },
                              }}
                              height={20}
                              iconProps={{
                                iconName: 'Delete',
                              }}
                              title="Delete"
                              ariaLabel="Delete"
                              onClick={() => {
                                dispatch(
                                  controlActions.toggleCommonDialogVisibility(
                                    new DialogArgs(
                                      CommonDialogType.Delete,
                                      'Delete option group',
                                      `Are you sure you want to delete ${props.group.name}?`,
                                      () => {
                                        let action = assignPendingActions(
                                          productSettingsActions.deleteOptionGroupById(
                                            props.group.key
                                          ),
                                          [],
                                          [],
                                          (args: any) => {
                                            let action = assignPendingActions(
                                              productSettingsActions.getAllOptionGroupsList(),
                                              [],
                                              [],
                                              (args: any) => {
                                                dispatch(
                                                  productSettingsActions.updateOptionGroupList(
                                                    args
                                                  )
                                                );
                                              }
                                            );
                                            dispatch(action);
                                          }
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
              <div style={{ paddingLeft: '60px' }}>
                <DetailsRow
                  styles={{
                    root: {
                      paddingLeft: '12px',
                    },
                  }}
                  {...args}
                />
              </div>
            );
          }}
        />
      </ScrollablePane>
    </div>
  );
};

export default ProductSettingsList;
