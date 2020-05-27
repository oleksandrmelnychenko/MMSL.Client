import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productSettingsActions } from '../../../redux/slices/productSettings.slice';
import OptionItemsOrderingList from './OptionItemsOrderingList';
import ManagingProductUnitForm, {
  ManagingProductUnitFormProps,
} from './ManagingProductUnitForm';
import {
  Stack,
  FocusZoneDirection,
  FocusZone,
  Separator,
  ICommandBarItemProps,
} from 'office-ui-fabric-react';
import { OptionUnit } from '../../../interfaces';
import { IApplicationState } from '../../../redux/reducers';
import { assignPendingActions } from '../../../helpers/action.helper';
import { controlActions } from '../../../redux/slices/control.slice';
import {
  DialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';

class OptionGroupDetailsProps extends ManagingProductUnitFormProps {
  constructor() {
    super();

    this.panelNewButton = null;
    this.panelDeleteButton = null;
  }

  panelNewButton: ICommandBarItemProps | null | undefined;
  panelDeleteButton: ICommandBarItemProps | null | undefined;
}

export const OptionGroupDetails: React.FC<OptionGroupDetailsProps> = (
  props: OptionGroupDetailsProps
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let action = assignPendingActions(
      productSettingsActions.getAllOptionGroupsList(),
      [],
      [],
      (args: any) => {
        dispatch(productSettingsActions.updateOptionGroupList(args));
      }
    );
    dispatch(action);
  }, [dispatch]);

  const sectedOptionUnit: OptionUnit | null = useSelector<
    IApplicationState,
    OptionUnit | null
  >(
    (state) => state.productSettings.managingOptionUnitsState.selectedOptionUnit
  );
  const sectedOptionGroupId: number | null | undefined = useSelector<
    IApplicationState,
    number | null | undefined
  >(
    (state) =>
      state.productSettings.managingOptionUnitsState.targetOptionGroup?.id
  );

  const isUnitFormVisible: boolean = useSelector<IApplicationState, boolean>(
    (state) =>
      state.productSettings.managingOptionUnitsState.isOptionUnitFormVisible
  );

  if (props.panelNewButton) {
    props.panelNewButton.onClick = () => {
      dispatch(productSettingsActions.toggleOptionUnitFormVisibility(true));
      dispatch(productSettingsActions.changeTargetOptionunit(null));
    };
  }

  if (props.panelDeleteButton) {
    props.panelDeleteButton.disabled = sectedOptionUnit ? false : true;

    props.panelDeleteButton.onClick = () => {
      if (sectedOptionUnit) {
        dispatch(
          controlActions.toggleCommonDialogVisibility(
            new DialogArgs(
              CommonDialogType.Delete,
              'Delete option unit',
              `Are you sure you want to delete ${sectedOptionUnit.value}?`,
              () => {
                let action = assignPendingActions(
                  productSettingsActions.deleteOptionUnitById(
                    sectedOptionUnit.id
                  ),
                  [
                    productSettingsActions.changeTargetOptionunit(null),
                    productSettingsActions.toggleOptionUnitFormVisibility(
                      false
                    ),
                  ],
                  [],
                  (args: any) => {
                    let action = assignPendingActions(
                      productSettingsActions.getAllOptionGroupsList(),
                      [],
                      [],
                      (args: any) => {
                        dispatch(
                          productSettingsActions.updateOptionGroupList(args)
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
      }
    };
  }

  return (
    <div>
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}>
        <Stack.Item grow={1} styles={{ root: { maxWidth: '49%' } }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Option units</Separator>
              <OptionItemsOrderingList />
            </div>
          </FocusZone>
        </Stack.Item>
        <Stack.Item grow={1}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'list'} data-is-scrollable={true}>
              <Separator alignContent="start">
                {`Details: ${sectedOptionUnit ? sectedOptionUnit.value : ''}`}
              </Separator>

              {isUnitFormVisible ? (
                <ManagingProductUnitForm
                  formikReference={props.formikReference}
                  relativeOptionGroupId={sectedOptionGroupId}
                  submitAction={(args: any) => {
                    if (sectedOptionUnit) {
                      /// Update unit
                      let action = assignPendingActions(
                        productSettingsActions.updateOptionUnit(args),
                        [
                          productSettingsActions.changeTargetOptionunit(null),
                          productSettingsActions.toggleOptionUnitFormVisibility(
                            false
                          ),
                        ],
                        [],
                        (successResponseArgs: any) => {
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

                          props.formikReference.formik.resetForm();
                        }
                      );
                      dispatch(action);
                    } else {
                      /// Creating new unit
                      let action = assignPendingActions(
                        productSettingsActions.saveNewOptionUnit(args),
                        [
                          productSettingsActions.changeTargetOptionunit(null),
                          productSettingsActions.toggleOptionUnitFormVisibility(
                            false
                          ),
                        ],
                        [],
                        (successResponseArgs: any) => {
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

                          props.formikReference.formik.resetForm();
                        }
                      );
                      dispatch(action);
                    }
                  }}
                  optionUnit={sectedOptionUnit}
                />
              ) : null}
            </div>
          </FocusZone>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default OptionGroupDetails;
