import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Toggle,
  Dropdown,
  Checkbox,
  Text,
  Stack,
  TextField,
  MaskedTextField,
  ITextProps,
  IDropdownOption,
  PrimaryButton,
} from 'office-ui-fabric-react';
import './createDealer.scss';
import ManageDealerForm, { FormicReference } from './ManageDealerForm';
import * as Yup from 'yup';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { useDispatch, useSelector } from 'react-redux';
import { assignPendingActions } from '../../helpers/action.helper';
import { FontSizes, FontWeights } from 'office-ui-fabric-react/lib/Styling';
import {
  DealerAccount,
  Address,
  PaymentType,
  Currency,
} from '../../interfaces';
import { IApplicationState } from '../../redux/reducers';
import * as controlActions from '../../redux/actions/control.actions';
import { ToggleDealerPanelWithDetails } from '../../redux/reducers/dealer.reducer';
import * as dealerAction from '../../redux/actions/dealer.actions';

class DealerDetailsProps {}

const buildDealerAccount = (values: any) => {
  let dealerAccount: DealerAccount = {
    id: 0,
    isDeleted: false,
    companyName: values.companyName,
    email: values.email,
    alternateEmail: values.alternativeEmail,
    phoneNumber: values.phoneNumber,
    taxNumber: values.taxNumber,
    isVatApplicable: values.vatApplicate,
    currency: values.selectCurrency,
    paymentType: values.selectPayment,
    isCreditAllowed: values.creditAllowed,
    billingAddressId: null,
    billingAddress: null,
    useBillingAsShipping: values.useBillingAsShipping,
    shippingAddressId: null,
    /// TODO:
    shippingAddress: null,
    stores: [],
  } as DealerAccount;

  let billingAddress = {
    addressLine1: values.addressLine1,
    addressLine2: values.addressLine2,
    city: values.city,
    state: values.state,
    country: values.country,
    zipCode: values.zip,
  } as Address;

  dealerAccount.billingAddress = billingAddress;

  return dealerAccount;
};

export const DealerDetails: React.FC<DealerDetailsProps> = (
  props: DealerDetailsProps
) => {
  const [formikReference] = useState<FormicReference>(new FormicReference());

  const dispatch = useDispatch();
  const selectedDealer = useSelector<IApplicationState, DealerAccount>(
    (state) => state.dealer.selectedDealer!
  );

  const textFildLabelStyles = {
    subComponentStyles: {
      label: {
        root: {
          fontWeight: FontWeights.light,
          paddingBottom: '2px',
        },
      },
    },
  };

  const dropDownStyles = {
    dropdown: { width: 300 },
    label: {
      fontWeight: FontWeights.light,
      paddingBottom: '2px',
    },
    title: {
      letterSpacing: '1px',
    },
  };

  const toggleStyles = {
    label: {
      fontWeight: FontWeights.light,
    },
  };

  return (
    <div>
      <Stack horizontal className="dealerPanelHeader">
        <Text className="dealerPanelHeader__title">Dealer Details</Text>
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

      <ManageDealerForm
        formikReference={formikReference}
        dealerAccount={selectedDealer}
        submitAction={(args: any) => {
          let createAction = assignPendingActions(
            dealerActions.updateDealer(args),
            [
              dealerActions.isOpenPanelWithDealerDetails(
                new ToggleDealerPanelWithDetails()
              ),
              dealerActions.getDealersListPaginated(),
            ]
          );
          dispatch(createAction);
        }}
      />
    </div>
  );
};

export default DealerDetails;
