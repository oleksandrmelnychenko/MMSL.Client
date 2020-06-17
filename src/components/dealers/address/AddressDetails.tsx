import React, { useState } from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react';
import { dealerActions } from '../../../redux/slices/dealer.slice';
import { controlActions } from '../../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import { assignPendingActions } from '../../../helpers/action.helper';
import { FormicReference } from '../../../interfaces';
import { DealerAccount } from '../../../interfaces/dealer';
import { IApplicationState } from '../../../redux/reducers';
import { ToggleDealerPanelWithDetails } from '../../../redux/slices/dealer.slice';
import PanelTitle from '../panel/PanelTitle';
import {
  commandBarButtonStyles,
  commandBarStyles,
} from '../../../common/fabric-styles/styles';
import BillingAddressForm from './BillingAddressForm';
import { dealerAccountActions } from '../../../redux/slices/dealerAccount.slice';

class DealerDetailsProps {}

export const DealerDetails: React.FC<DealerDetailsProps> = (
  props: DealerDetailsProps
) => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = (isDirty: boolean) => {
        setIsDirtyForm(isDirty);
      };
    })
  );
  const [isDirtyForm, setIsDirtyForm] = useState(false);

  const targetDealer = useSelector<IApplicationState, DealerAccount | null>(
    (state) => state.dealerAccount.targetDealer
  );

  const _items: ICommandBarItemProps[] = [
    {
      key: 'Save',
      text: 'Save',
      disabled: !isDirtyForm,
      iconProps: { iconName: 'Save' },
      onClick: () => {
        let formik: any = formikReference.formik;

        if (formik !== undefined && formik !== null) {
          formik.submitForm();
        }
      },
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: 'Reset',
      text: 'Reset',
      disabled: !isDirtyForm,
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        formikReference.formik.resetForm();
      },
      buttonStyles: commandBarButtonStyles,
    },
  ];

  return (
    <div>
      <PanelTitle
        title={'Address'}
        description={
          targetDealer ? [targetDealer.companyName, targetDealer.email] : null
        }
      />
      <div>
        <CommandBar
          styles={commandBarStyles}
          items={_items}
          className="dealers__store__controls"
        />
      </div>
      <BillingAddressForm
        formikReference={formikReference}
        dealerAccount={targetDealer}
        submitAction={(args: any) => {
          let createAction = assignPendingActions(
            dealerAccountActions.apiUpdateDealer(args),
            [],
            [],
            (args: any) => {
              dispatch(dealerAccountActions.changeTargetDealer(null));
              dispatch(controlActions.closeInfoPanelWithComponent());
              dispatch(
                dealerActions.isOpenPanelWithDealerDetails(
                  new ToggleDealerPanelWithDetails()
                )
              );
              /// TODO: rewrite without this additional api call
              dispatch(dealerAccountActions.apiGetDealersPaginatedFlow());
            },
            (args: any) => {}
          );
          dispatch(createAction);
        }}
      />
    </div>
  );
};

export default DealerDetails;
