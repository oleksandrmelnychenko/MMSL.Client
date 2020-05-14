import React from 'react';
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
} from 'office-ui-fabric-react';
import './createDealer.scss';
import * as Yup from 'yup';
import * as dealerActions from '../../redux/actions/dealer.actions';
import { useDispatch } from 'react-redux';
import { assignPendingActions } from '../../helpers/action.helper';
import { FontSizes, FontWeights } from 'office-ui-fabric-react/lib/Styling';
import {
  DealerAccount,
  Address,
  PaymentType,
  Currency,
} from '../../interfaces';

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
  const dispatch = useDispatch();

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

  return <div>Dealer details</div>;
};

export default DealerDetails;
