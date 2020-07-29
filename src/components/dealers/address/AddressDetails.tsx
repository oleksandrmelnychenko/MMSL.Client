import React, { useState } from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react';
import { dealerActions } from '../../../redux/slices/dealer.slice';
import { infoPanelActions } from '../../../redux/slices/infoPanel.slice';
import { useDispatch, useSelector } from 'react-redux';
import { assignPendingActions } from '../../../helpers/action.helper';
import { FormicReference } from '../../../interfaces';
import { DealerAccount } from '../../../interfaces/dealer';
import { IApplicationState } from '../../../redux/reducers';
import { ToggleDealerPanelWithDetails } from '../../../redux/slices/dealer.slice';
import PanelTitle from '../../../common/panel/PanelTitle';
import {
  commandBarButtonStyles,
  commandBarStyles,
} from '../../../common/fabric-styles/styles';
import BillingAddressForm from './BillingAddressForm';

class DealerDetailsProps {}

export const DealerDetails: React.FC<DealerDetailsProps> = (
  props: DealerDetailsProps
) => {
  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = (isDirty: boolean) => {
        setIsDirtyForm(isDirty);
      };
    })
  );
  const [isDirtyForm, setIsDirtyForm] = useState(false);

  const dispatch = useDispatch();
  const selectedDealer = useSelector<IApplicationState, DealerAccount>(
    (state) => state.dealer.selectedDealer!
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
          selectedDealer
            ? [selectedDealer.companyName, selectedDealer.email]
            : null
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
        dealerAccount={selectedDealer}
        submitAction={(args: any) => {
          let createAction = assignPendingActions(
            dealerActions.updateDealer(args),
            [
              dealerActions.setSelectedDealer(null),
              infoPanelActions.closeInfoPanelWithComponent(),
              dealerActions.isOpenPanelWithDealerDetails(
                new ToggleDealerPanelWithDetails()
              ),
              dealerActions.apiGetDealersListPaginated(),
            ]
          );
          dispatch(createAction);
        }}
      />
    </div>
  );
};

export default DealerDetails;
