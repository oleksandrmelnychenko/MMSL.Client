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
  FormicReference,
  OptionUnit,
} from '../../../interfaces';
import { List } from 'linq-typescript';
import * as productSettingsActions from '../../../redux/actions/productSettings.actions';
import * as productCategoryActions from '../../../redux/actions/productCategory.actions';
import { assignPendingActions } from '../../../helpers/action.helper';
import './productCategoryDetails.scss';
import UnitRowItem from '../../productSettings/UnitRowItem';

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

export class ProductCategoryDetailsProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.submitAction = (args: any) => {};
  }

  formikReference: FormicReference;
  submitAction: (args: any) => void;
}

export enum GroupSelectionSource {
  Assigned,
  Probable,
}

export class GroupSelection {
  constructor() {
    this.groupId = 0;
    this.selectionSource = GroupSelectionSource.Assigned;
    this.optionUnits = [];
  }

  groupId: number;
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

  const renderCommonGroupItem = (
    item: OptionGroup | null | undefined,
    key: number | null | undefined
  ): JSX.Element => {
    let result: JSX.Element = <div>{'Undefined option group'}</div>;

    if (item && key) {
      let mandatoryColor = item.isMandatory ? '#2b579a' : '#2b579a60';

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
        >
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Label
              styles={{
                root: {
                  cursor: 'pointer',
                },
              }}
              onClick={() => {
                if (item.id !== groupSelection?.groupId) {
                  setgroupSelection({
                    groupId: item.id,
                    selectionSource: GroupSelectionSource.Assigned,
                    optionUnits: item.optionUnits,
                  });
                } else {
                  if (
                    GroupSelectionSource.Assigned !==
                    groupSelection?.selectionSource
                  ) {
                    setgroupSelection({
                      groupId: item.id,
                      selectionSource: GroupSelectionSource.Assigned,
                      optionUnits: item.optionUnits,
                    });
                  }
                }
              }}
            >{`Name: ${item.name}`}</Label>{' '}
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
        </div>
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
        <div
          key={key}
          className={
            groupSelection &&
            groupSelection.selectionSource === GroupSelectionSource.Probable &&
            groupSelection.groupId === item.id
              ? 'productCategoryDetails__groupItem__selected'
              : 'productCategoryDetails__groupItem'
          }
        >
          <Stack tokens={{ childrenGap: 1 }}>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <Label
                styles={{
                  root: {
                    cursor: 'pointer',
                  },
                }}
                onClick={() => {
                  if (item.id !== groupSelection?.groupId) {
                    setgroupSelection({
                      groupId: item.id,
                      selectionSource: GroupSelectionSource.Probable,
                      optionUnits: item.optionUnits,
                    });
                  } else {
                    if (
                      GroupSelectionSource.Assigned !==
                      groupSelection?.selectionSource
                    ) {
                      setgroupSelection({
                        groupId: item.id,
                        selectionSource: GroupSelectionSource.Probable,
                        optionUnits: item.optionUnits,
                      });
                    }
                  }
                }}
              >{`Name: ${item.name}`}</Label>{' '}
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
                console.log('Unknown option group map');
              }
            } else {
              /// TODO: unhandled case
              console.log('Unknown option group map');
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

  // styles={{ root: { maxWidth: '49%' } }}
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

        <Stack.Item grow={1} styles={{ root: { maxWidth: '33%' } }}>
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

        <Stack.Item
          grow={3}
          styles={{ root: { maxWidth: '33%', minWidth: '33%' } }}
        >
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Group units</Separator>
              <Stack tokens={{ childrenGap: 9 }}>
                {groupSelection &&
                groupSelection.optionUnits &&
                groupSelection.optionUnits.length > 0
                  ? new List<OptionUnit>(groupSelection.optionUnits)
                      .select((item: OptionUnit) => (
                        <UnitRowItem optionUnit={item} />
                      ))
                      .toArray()
                  : 'No option groups'}
                {/* {'No option units'} */}
              </Stack>
            </div>
          </FocusZone>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default ProductCategoryDetails;
