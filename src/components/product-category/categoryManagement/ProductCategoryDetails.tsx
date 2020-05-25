import React, { useEffect, useState } from 'react';
import Stack from 'office-ui-fabric-react/lib/components/Stack/Stack';
import {
  FocusZone,
  FocusZoneDirection,
  Separator,
  Label,
  FontIcon,
  mergeStyles,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  Checkbox,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import {
  ProductCategory,
  OptionGroup,
  ProductCategoryMapOptionGroup,
} from '../../../interfaces';
import { List } from 'linq-typescript';
import * as productSettingsActions from '../../../redux/actions/productSettings.actions';
import * as productCategoryActions from '../../../redux/actions/productCategory.actions';
import { assignPendingActions } from '../../../helpers/action.helper';

class ProductCategoryDetailsProps {}

const resolveIsWasAddedBefore = (
  groupId: number,
  source: ProductCategoryMapOptionGroup[]
) => {
  return new List<ProductCategoryMapOptionGroup>(source).firstOrDefault(
    (mapItem) => {
      return groupId === mapItem.optionGroupId;
    }
  ) !== undefined
    ? true
    : false;
};

export enum ItemAdditionState {
  NoChanges,
  WillBeAdded,
  WillBeRemoved,
}

export class GroupItemViewModel {
  constructor(groupId: number, isCheckedInit: boolean) {
    this._isCheckedInit = isCheckedInit;

    this.groupId = groupId;
    this.isChecked = this._isCheckedInit;

    this.itemAdditionState = ItemAdditionState.NoChanges;
  }

  private _isCheckedInit: boolean;
  groupId: number;
  isChecked: boolean;
  itemAdditionState: ItemAdditionState;

  setIsChecked: (checkedValue: boolean) => void = (checkedValue: boolean) => {
    this.isChecked = checkedValue;

    if (this._isCheckedInit !== this.isChecked) {
      if (this.isChecked)
        this.itemAdditionState = ItemAdditionState.WillBeAdded;
      else this.itemAdditionState = ItemAdditionState.WillBeRemoved;
    } else {
      this.itemAdditionState = ItemAdditionState.NoChanges;
    }
  };
}

export const ProductCategoryDetails: React.FC<ProductCategoryDetailsProps> = (
  props: ProductCategoryDetailsProps
) => {
  const dispatch = useDispatch();

  const [groupItemVMs, setGroupItemVMs] = useState<GroupItemViewModel[]>([]);

  const targetProductCategory: ProductCategory | null | undefined = useSelector<
    IApplicationState,
    ProductCategory | null | undefined
  >((state) => state.product.choose.category);

  const allOptionGroups: OptionGroup[] = useSelector<
    IApplicationState,
    OptionGroup[]
  >(
    (state) => state.product.productCategoryDetailsManagingState.allOptionGroups
  );

  useEffect(() => {
    let action = assignPendingActions(
      productSettingsActions.getAllOptionGroupsList(),
      [],
      [],
      (args: any) => {
        dispatch(productCategoryActions.updateOptiongroupsList(args));
      }
    );
    dispatch(action);
  }, [dispatch, setGroupItemVMs]);

  useEffect(() => {
    if (targetProductCategory && targetProductCategory.optionGroupMaps) {
      setGroupItemVMs(
        new List(allOptionGroups)
          .select<GroupItemViewModel>((group: OptionGroup) => {
            let result = new GroupItemViewModel(
              group.id,
              resolveIsWasAddedBefore(
                group.id,
                targetProductCategory.optionGroupMaps
              )
            );

            return result;
          })
          .toArray()
      );
    }
  }, [targetProductCategory, allOptionGroups, setGroupItemVMs]);

  const renderCommonGroupItem = (
    item: OptionGroup | null | undefined,
    key: number | null | undefined
  ): JSX.Element => {
    let result: JSX.Element = <div>{'Undefined option group'}</div>;

    if (item && key) {
      let mandatoryColor = item.isMandatory ? '#2b579a' : '#2b579a60';

      result = (
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <Label>{`Name: ${item.name}`}</Label>{' '}
          <TooltipHost
            id={`mandatoryTooltip_${key}`}
            calloutProps={{ gapSpace: 0 }}
            delay={TooltipDelay.zero}
            directionalHint={DirectionalHint.bottomCenter}
            styles={{ root: { display: 'inline-block' } }}
            content={item.isMandatory ? 'Mandatory' : 'Not mandatory'}
          >
            <FontIcon
              style={{
                cursor: 'default',
              }}
              iconName="Warning"
              className={mergeStyles({
                fontSize: 16,
                color: mandatoryColor,
              })}
            />
          </TooltipHost>
        </Stack>
      );
    }

    return result;
  };

  const renderAssignableCommonGroupItem = (
    item: OptionGroup | null | undefined,
    key: number | null | undefined
  ): JSX.Element => {
    let result: JSX.Element = <div>{'Undefined option group'}</div>;

    if (item && key && targetProductCategory) {
      let mandatoryColor = item.isMandatory ? '#2b579a' : '#2b579a60';

      let isWasAttachedBefore: boolean = false;

      const vm = new List(groupItemVMs).firstOrDefault(
        (vMItem) => vMItem.groupId === item.id
      );

      if (vm) {
        isWasAttachedBefore = vm.isChecked;
      }

      result = (
        <Stack tokens={{ childrenGap: 1 }}>
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Label>{`Name: ${item.name}`}</Label>{' '}
            <TooltipHost
              id={`mandatoryTooltip_${key}`}
              calloutProps={{ gapSpace: 0 }}
              delay={TooltipDelay.zero}
              directionalHint={DirectionalHint.bottomCenter}
              styles={{ root: { display: 'inline-block' } }}
              content={item.isMandatory ? 'Mandatory' : 'Not mandatory'}
            >
              <FontIcon
                style={{
                  cursor: 'default',
                }}
                iconName="Warning"
                className={mergeStyles({
                  fontSize: 16,
                  color: mandatoryColor,
                })}
              />
            </TooltipHost>
            <div style={{ color: 'Red' }}>
              {vm?.itemAdditionState === ItemAdditionState.NoChanges
                ? ''
                : vm?.itemAdditionState === ItemAdditionState.WillBeAdded
                ? 'Add'
                : 'Remove'}
            </div>
          </Stack>

          <Checkbox
            onChange={(eventArgs?: any, isChecked?: boolean) => {
              const vmItem = new List(groupItemVMs).firstOrDefault(
                (vm) => vm.groupId === item.id
              );

              if (vmItem && isChecked !== undefined) {
                vmItem.setIsChecked(isChecked);
                setGroupItemVMs(new List(groupItemVMs).toArray());
              }
            }}
            label="Is assigned"
            checked={isWasAttachedBefore}
          />
        </Stack>
      );
    }

    return result;
  };

  return (
    <div>
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}>
        <Stack.Item grow={1} styles={{ root: { maxWidth: '49%' } }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Assigned groups</Separator>

              {targetProductCategory && targetProductCategory.optionGroupMaps
                ? new List<ProductCategoryMapOptionGroup>(
                    targetProductCategory.optionGroupMaps
                  )
                    .select((item: ProductCategoryMapOptionGroup) =>
                      renderCommonGroupItem(
                        item.optionGroup,
                        item.optionGroup?.id
                      )
                    )
                    .toArray()
                : 'No assignments'}
            </div>
          </FocusZone>
        </Stack.Item>

        <Stack.Item grow={1} styles={{ root: { maxWidth: '49%' } }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Option Groups</Separator>
              <Stack tokens={{ childrenGap: 9 }}>
                {allOptionGroups.length > 0
                  ? new List<OptionGroup>(allOptionGroups)
                      .select((item: OptionGroup) =>
                        renderAssignableCommonGroupItem(item, item.id)
                      )
                      .toArray()
                  : 'No option groups'}
              </Stack>
            </div>
          </FocusZone>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default ProductCategoryDetails;
