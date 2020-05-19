import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as productSettingsActions from '../../../redux/actions/productSettings.actions';
import OptionItemsOrderingList from './OptionItemsOrderingList';
import ManagingProductUnitForm, {
  ManagingProductUnitFormProps,
} from './ManagingProductUnitForm';
import {
  Stack,
  FocusZoneDirection,
  FocusZone,
  Separator,
} from 'office-ui-fabric-react';
import { OptionUnit } from '../../../interfaces';
import { IApplicationState } from '../../../redux/reducers';
import { assignPendingActions } from '../../../helpers/action.helper';

class OptionGroupDetailsProps extends ManagingProductUnitFormProps {}

export const OptionGroupDetails: React.FC<OptionGroupDetailsProps> = (
  props: OptionGroupDetailsProps
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productSettingsActions.getAllOptionGroupsList());
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

  return (
    <div className="customerList">
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}
      >
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
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Details:</Separator>
              <ManagingProductUnitForm
                formikReference={props.formikReference}
                submitAction={(args: any) => {
                  debugger;

                  if (sectedOptionGroupId) {
                    args.unit.optionGroupId = sectedOptionGroupId;

                    let action = assignPendingActions(
                      productSettingsActions.saveNewOptionUnit(args),
                      // productSettingsActions.updateOptionUnit(args),
                      [productSettingsActions.getAllOptionGroupsList()]
                    );
                    dispatch(action);
                  } else {
                    debugger;
                    /// TODO: smth goes wrong!!!
                  }
                }}
                optionUnit={sectedOptionUnit}
              />
            </div>
          </FocusZone>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default OptionGroupDetails;
