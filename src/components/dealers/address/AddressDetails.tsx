import React, { useState } from 'react';
import { Text, Stack, PrimaryButton } from 'office-ui-fabric-react';
import BillingAddressForm, {
  FormicReference,
} from '../address/BillingAddressForm';
import * as dealerActions from '../../../redux/actions/dealer.actions';
import * as controlAction from '../../../redux/actions/control.actions';
import { useDispatch, useSelector } from 'react-redux';
import { assignPendingActions } from '../../../helpers/action.helper';
import { DealerAccount } from '../../../interfaces';
import { IApplicationState } from '../../../redux/reducers';
import { ToggleDealerPanelWithDetails } from '../../../redux/reducers/dealer.reducer';
import PanelTitle from '../panel/PanelTitle';
import PanelFooter from '../panel/PanelFooter';

class DealerDetailsProps {}

export const DealerDetails: React.FC<DealerDetailsProps> = (
  props: DealerDetailsProps
) => {
  const [formikReference] = useState<FormicReference>(new FormicReference());

  const dispatch = useDispatch();
  const selectedDealer = useSelector<IApplicationState, DealerAccount>(
    (state) => state.dealer.selectedDealer!
  );

  return (
    <div>
      <PanelTitle title={'Dealer Address'} />

      <BillingAddressForm
        formikReference={formikReference}
        dealerAccount={selectedDealer}
        submitAction={(args: any) => {
          let createAction = assignPendingActions(
            dealerActions.updateDealer(args),
            [
              dealerActions.setSelectedDealer(null),
              controlAction.isOpenPanelInfo(false),
              controlAction.isCollapseMenu(false),
              dealerActions.isOpenPanelWithDealerDetails(
                new ToggleDealerPanelWithDetails()
              ),
              dealerActions.getDealersListPaginated(),
            ]
          );
          dispatch(createAction);
        }}
      />
      <PanelFooter
        onSaveClick={() => {
          let formik: any = formikReference.formik;

          if (formik !== undefined && formik !== null) {
            formik.submitForm();
          }
        }}
      />
    </div>
  );
};

export default DealerDetails;
