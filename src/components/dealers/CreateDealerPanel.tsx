import React, { useState } from 'react';
import './dealers.scss';
import {
  DefaultButton,
  SearchBox,
  ActionButton,
  Stack,
  Panel,
  PanelType,
  PrimaryButton,
  Text,
  Label,
  getId,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { LocalizeState, getActiveLanguage } from 'react-localize-redux';
import * as dealerActions from '../../redux/actions/dealer.actions';
import {
  DatePicker,
  DayOfWeek,
  IDatePickerStrings,
  mergeStyleSets,
} from 'office-ui-fabric-react';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../redux/reducers/dealer.reducer';
import DealerDetails from './DealerDetails';
import ManageDealerForm, { FormicReference } from './ManageDealerForm';
import { assignPendingActions } from '../../helpers/action.helper';

export const CreateDealerPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const isAddDealerOpen = useSelector<IApplicationState, boolean>(
    (state) => state.dealer.manageDealerForm.isFormVisible
  );

  const [formikReference] = useState<FormicReference>(new FormicReference());

  return (
    <Panel
      isOpen={isAddDealerOpen}
      type={PanelType.custom}
      customWidth={'800px'}
      onDismiss={() => {
        dispatch(dealerActions.toggleNewDealerForm(false));
      }}
      onRenderHeader={() => {
        return (
          <Stack horizontal className="dealerPanelHeader">
            <Text className="dealerPanelHeader__title">Add Dealer</Text>
            <PrimaryButton
              className="dealerPanelHeader__save"
              onClick={() => {
                let formik: any = formikReference.formik;

                if (formik !== undefined && formik !== null) {
                  formik.submitForm();
                }
              }}
            >
              Save
            </PrimaryButton>
          </Stack>
        );
      }}
      closeButtonAriaLabel="Close"
    >
      {/* <CreateDealer formikReference={formikReference} /> */}
      <ManageDealerForm
        formikReference={formikReference}
        submitAction={(args: any) => {
          /// Old needed
          let createAction = assignPendingActions(
            dealerActions.saveNewDealer(args),
            [
              dealerActions.getDealersListPaginated(),
              dealerActions.toggleNewDealerForm(false),
            ]
          );
          dispatch(createAction);

          /// Copied
          // let createAction = assignPendingActions(
          //   dealerActions.updateDealer(args),
          //   [
          //     dealerActions.isOpenPanelWithDealerDetails(
          //       new ToggleDealerPanelWithDetails()
          //     ),
          //     dealerActions.getDealersListPaginated(),
          //   ]
          // );
          // dispatch(createAction);
        }}
      />
    </Panel>
  );
};

export default CreateDealerPanel;
