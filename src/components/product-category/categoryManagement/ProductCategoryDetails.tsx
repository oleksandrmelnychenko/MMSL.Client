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
import { FormicReference } from '../../../interfaces';
import { OptionGroup, OptionUnit } from '../../../interfaces/options';
import {
  ProductCategory,
  ProductCategoryMapOptionGroup,
} from '../../../interfaces/products';
import { List } from 'linq-typescript';
import { productSettingsActions } from '../../../redux/slices/productSettings.slice';
import { productActions } from '../../../redux/slices/product.slice';
import { assignPendingActions } from '../../../helpers/action.helper';
import './productCategoryDetails.scss';
import UnitRowItem from '../productSettings/stylesList/UnitRowItem';

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

/// Describes group item selection state
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

export class ProductCategoryDetailsProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.submitAction = (args: any) => {};
  }

  formikReference: FormicReference;
  submitAction: (args: any) => void;
}

/// Describes local group selection source from
/// assigned/probable (left/right column)
export enum GroupSelectionSource {
  Assigned,
  Probable,
}

export class GroupSelection {
  constructor() {
    this.groupId = 0;
    this.groupName = '';
    this.selectionSource = GroupSelectionSource.Assigned;
    this.optionUnits = [];
  }

  groupId: number;
  groupName: string;
  optionUnits: OptionUnit[];
  selectionSource: GroupSelectionSource;
}

export const ProductCategoryDetails: React.FC<ProductCategoryDetailsProps> = (
  props: ProductCategoryDetailsProps
) => {
  const dispatch = useDispatch();

  const [groupItemVMs, setGroupItemVMs] = useState<GroupItemViewModel[]>([]);
  const [groupSelection, setgroupSelection] = useState<GroupSelection | null>(
    null
  );

  const isDetailsDisabled: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.product.productCategoryDetailsManagingState.isDisabled
  );

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
    /// TODO: need to rewrite, it will not working now
    let action = assignPendingActions(
      productSettingsActions.apiGetAllOptionGroupsByProductIdList(0),
      [],
      [],
      (args: any) => {
        dispatch(productActions.updateOptiongroupsList(args));
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

  useEffect(() => {
    if (props.formikReference && props.formikReference.isDirtyFunc) {
      props.formikReference.formik.dirty = new List(groupItemVMs).any(
        (item) => item.itemAdditionState !== ItemAdditionState.NoChanges
      );

      props.formikReference.isDirtyFunc(
        props.formikReference.formik.dirty && !isDetailsDisabled
      );
    }
  }, [groupItemVMs, allOptionGroups, props.formikReference, isDetailsDisabled]);

  /// Group selection flow
  const onSelectGroup = (
    item: OptionGroup,
    selectionSource: GroupSelectionSource
  ) => {
    if (selectionSource !== groupSelection?.selectionSource) {
      setgroupSelection({
        groupId: item.id,
        groupName: item.name,
        selectionSource: selectionSource,
        optionUnits: item.optionUnits,
      });
    } else {
      if (item.id !== groupSelection?.groupId) {
        setgroupSelection({
          groupId: item.id,
          groupName: item.name,
          selectionSource: selectionSource,
          optionUnits: item.optionUnits,
        });
      }
    }
  };

  /// Build single hint lable
  const renderHintLable = (textMessage: string): JSX.Element => {
    const result = (
      <Label
        styles={{
          root: {
            fontWeight: 400,
            fontSize: '12px',
            color: '#a19f9d',
          },
        }}
      >
        {textMessage}
      </Label>
    );

    return result;
  };

  /// Render common `style inner block`
  const renderOptionGroupCommons = (
    item: OptionGroup | null | undefined,
    key: number | null | undefined
  ): JSX.Element => {
    let result = <div>{'Undefined style'}</div>;

    if (item && key) {
      let mandatoryColor = item.isMandatory ? '#2b579a' : '#2b579a60';

      result = (
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <Label
            styles={{
              root: {
                cursor: 'pointer',
                fontWeight: 400,
              },
            }}
          >{`${item.name}`}</Label>{' '}
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
                marginTop: '2px',
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

  /// Render `assigned` group item
  const renderAssignedGroupItem = (
    item: OptionGroup | null | undefined,
    key: number | null | undefined
  ): JSX.Element => {
    let result: JSX.Element = <div>{'Undefined style'}</div>;

    if (item && key) {
      result = (
        <div
          key={key}
          className={
            groupSelection &&
            groupSelection.selectionSource === GroupSelectionSource.Assigned &&
            groupSelection.groupId === item.id
              ? 'productCategoryDetails__groupItem selected'
              : 'productCategoryDetails__groupItem'
          }
          onClick={() => onSelectGroup(item, GroupSelectionSource.Assigned)}
        >
          {renderOptionGroupCommons(item, key)}
        </div>
      );
    }

    return result;
  };

  /// Render `assignable` group item
  const renderAssignableCommonGroupItem = (
    item: OptionGroup | null | undefined,
    key: number | null | undefined
  ): JSX.Element => {
    let result: JSX.Element = <div>{'Undefined style'}</div>;

    if (item && key && targetProductCategory) {
      let isWasAttachedBefore: boolean = false;

      const vm = new List(groupItemVMs).firstOrDefault(
        (vMItem) => vMItem.groupId === item.id
      );

      if (vm) {
        isWasAttachedBefore = vm.isChecked;
      }

      result = (
        <div
          key={key}
          style={{ height: '50px' }}
          className={
            groupSelection &&
            groupSelection.selectionSource === GroupSelectionSource.Probable &&
            groupSelection.groupId === item.id
              ? 'productCategoryDetails__groupItem selected'
              : 'productCategoryDetails__groupItem'
          }
          onClick={() => onSelectGroup(item, GroupSelectionSource.Probable)}
        >
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Checkbox
              styles={{ root: { marginTop: '5px' } }}
              onChange={(eventArgs?: any, isChecked?: boolean) => {
                const vmItem = new List(groupItemVMs).firstOrDefault(
                  (vm) => vm.groupId === item.id
                );

                if (vmItem && isChecked !== undefined) {
                  vmItem.setIsChecked(isChecked);
                  setGroupItemVMs(new List(groupItemVMs).toArray());
                }
              }}
              checked={isWasAttachedBefore}
            />

            <Stack>
              {renderOptionGroupCommons(item, key)}

              <Stack.Item
                styles={{ root: { position: 'relative', top: '-7px' } }}
              >
                <Label
                  styles={{
                    root: {
                      padding: 0,
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#a19f9d',
                    },
                  }}
                >
                  {vm?.itemAdditionState === ItemAdditionState.NoChanges
                    ? ''
                    : vm?.itemAdditionState === ItemAdditionState.WillBeAdded
                    ? 'Add'
                    : 'Remove'}
                </Label>
              </Stack.Item>
            </Stack>
          </Stack>
        </div>
      );
    }

    return result;
  };

  props.formikReference.formik = {
    submitForm: () => {
      if (
        !isDetailsDisabled &&
        targetProductCategory &&
        targetProductCategory.measurements
      ) {
        const affectedMaps = new List(groupItemVMs)
          .where(
            (item) => item.itemAdditionState !== ItemAdditionState.NoChanges
          )
          .select((item) => {
            let result: ProductCategoryMapOptionGroup = new ProductCategoryMapOptionGroup();

            if (item.itemAdditionState === ItemAdditionState.WillBeAdded) {
              result.productCategoryId = targetProductCategory.id;
              result.optionGroupId = item.groupId;
            } else if (
              item.itemAdditionState === ItemAdditionState.WillBeRemoved
            ) {
              const mapToRemove = new List(
                targetProductCategory.optionGroupMaps
              ).firstOrDefault((map) => map.optionGroupId === item.groupId);

              if (mapToRemove) {
                mapToRemove.isDeleted = true;
                result = mapToRemove;
              } else {
                /// TODO: unhandled case
                console.log('Unknown style map');
              }
            } else {
              /// TODO: unhandled case
              console.log('Unknown style map');
            }

            return result;
          })
          .toArray();

        props.submitAction(affectedMaps);
      }
    },
    resetForm: () => {
      if (
        !isDetailsDisabled &&
        targetProductCategory &&
        targetProductCategory.optionGroupMaps
      ) {
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
    },
    dirty: false,
  };

  return (
    <div className="productCategoryDetails">
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}
      >
        <Stack.Item grow={1} styles={{ root: { maxWidth: '33%' } }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div data-is-scrollable={true}>
              <Separator alignContent="start">Assigned styles</Separator>

              {targetProductCategory && targetProductCategory.optionGroupMaps
                ? new List<ProductCategoryMapOptionGroup>(
                    targetProductCategory.optionGroupMaps
                  )
                    .select((item: ProductCategoryMapOptionGroup) =>
                      renderAssignedGroupItem(
                        item.optionGroup,
                        item.optionGroup?.id
                      )
                    )
                    .toArray()
                : renderHintLable('No assigned styles')}
            </div>
          </FocusZone>
        </Stack.Item>

        <Stack.Item grow={1} styles={{ root: { maxWidth: '33%' } }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Available styles</Separator>
              <Stack tokens={{ childrenGap: 0 }}>
                {allOptionGroups.length > 0
                  ? new List<OptionGroup>(allOptionGroups)
                      .select((item: OptionGroup) =>
                        renderAssignableCommonGroupItem(item, item.id)
                      )
                      .toArray()
                  : renderHintLable('No styles')}
              </Stack>
            </div>
          </FocusZone>
        </Stack.Item>

        <Stack.Item
          grow={3}
          styles={{ root: { maxWidth: '33%', minWidth: '33%' } }}
        >
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">
                {groupSelection
                  ? `${groupSelection.groupName} settings`
                  : `Settings`}
              </Separator>
              <Stack tokens={{ childrenGap: 12 }}>
                {groupSelection
                  ? groupSelection.optionUnits.length > 0
                    ? new List<OptionUnit>(groupSelection.optionUnits)
                        .select((item: OptionUnit) => (
                          <UnitRowItem
                            takeMarginWhenNoImage={new List(
                              groupSelection.optionUnits
                            ).any(
                              (unitItem) =>
                                unitItem.imageUrl !== null &&
                                unitItem.imageUrl !== undefined &&
                                unitItem.imageUrl.length > 0
                            )}
                            key={item.id}
                            optionUnit={item}
                          />
                        ))
                        .toArray()
                    : renderHintLable('There are no settings')
                  : renderHintLable('Select style and explore settings')}
              </Stack>
            </div>
          </FocusZone>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default ProductCategoryDetails;
