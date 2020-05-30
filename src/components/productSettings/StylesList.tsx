import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { OptionGroup, OptionUnit } from '../../interfaces';
import { assignPendingActions } from '../../helpers/action.helper';
import {
  productSettingsActions,
  ManagingPanelComponent,
} from '../../redux/slices/productSettings.slice';

import { List } from 'office-ui-fabric-react/lib/List';
import UnitRowItem from './UnitStyleItem';
import {
  Stack,
  TooltipHost,
  DirectionalHint,
  TooltipDelay,
  FontIcon,
  Text,
  mergeStyles,
  ActionButton,
} from 'office-ui-fabric-react';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../redux/slices/control.slice';
import * as fabricStyles from '../../common/fabric-styles/styles';

export const StylesList: React.FC = () => {
  const dispatch = useDispatch();

  const onRenderCell = (item: any, index: number | undefined): JSX.Element => {
    return (
      <div>
        <Stack
          className="option-group__header"
          horizontal
          verticalAlign="center"
          horizontalAlign="space-between"
          tokens={{ childrenGap: 0 }}
          styles={fabricStyles.stackStyleList}>
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Text styles={fabricStyles.textStackStyle}>{item.name}</Text>
            <TooltipHost
              id={`mandatoryTooltip_${item.id}`}
              calloutProps={{ gapSpace: 0 }}
              delay={TooltipDelay.zero}
              directionalHint={DirectionalHint.bottomCenter}
              styles={{ root: { display: 'inline-block' } }}
              content={item.isMandatory ? 'Mandatory' : 'Not mandatory'}>
              <FontIcon
                iconName="Warning"
                className={mergeStyles({
                  fontSize: 16,
                  color: item.isMandatory ? '#2b579a' : '#2b579a60',
                })}
              />
            </TooltipHost>
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <ActionButton
              styles={fabricStyles.columnIconButtonStyle}
              iconProps={{
                iconName: 'Settings',
              }}
              title="Settings"
              ariaLabel="Settings"
              onClick={() => {
                let action = assignPendingActions(
                  productSettingsActions.getAndSelectOptionGroupById(
                    parseInt(item.id)
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

            <ActionButton
              styles={fabricStyles.columnIconButtonStyle}
              iconProps={{
                iconName: 'Edit',
              }}
              title="Edit"
              ariaLabel="Edit"
              onClick={() => {
                let action = assignPendingActions(
                  productSettingsActions.getAndSelectOptionGroupForSingleEditById(
                    item.id
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

            <ActionButton
              styles={fabricStyles.columnIconButtonStyle}
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
                      `Are you sure you want to delete ${item.name}?`,
                      () => {
                        let action = assignPendingActions(
                          productSettingsActions.deleteOptionGroupById(item.id),
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
        <Stack
          wrap={true}
          className="stack_option"
          horizontal
          tokens={{ childrenGap: 20 }}>
          {item.optionUnits
            ? item.optionUnits.map((item: OptionUnit) => (
                <React.Fragment key={item.id}>
                  <UnitRowItem optionUnit={item} />
                </React.Fragment>
              ))
            : null}
        </Stack>
      </div>
    );
  };

  const outionGroups: OptionGroup[] = useSelector<
    IApplicationState,
    OptionGroup[]
  >((state) => state.productSettings.optionGroupsList);

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

  return (
    <div className="wrapper-list">
      <List items={outionGroups} onRenderCell={onRenderCell} />
    </div>
  );
};

export default StylesList;
