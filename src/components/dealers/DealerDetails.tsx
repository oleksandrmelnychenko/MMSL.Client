import React, { useState } from 'react';
import ManageDealerForm from './dealerManaging/ManageDealerForm';
import * as dealerActions from '../../redux/actions/dealer.actions';
import * as controlAction from '../../redux/actions/control.actions';
import { useDispatch, useSelector } from 'react-redux';
import { assignPendingActions } from '../../helpers/action.helper';
import { DealerAccount, FormicReference } from '../../interfaces';
import { IApplicationState } from '../../redux/reducers';
import { ToggleDealerPanelWithDetails } from '../../redux/reducers/dealer.reducer';
import PanelTitle from './panel/PanelTitle';
import './dealerDetails.scss';
import { ICommandBarItemProps, CommandBar } from 'office-ui-fabric-react';
import {
  commandBarButtonStyles,
  commandBarStyles,
} from '../../common/fabric-styles/styles';

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
    <div className="dealerDetails">
      <PanelTitle
        title={'Details'}
        description={
          selectedDealer
            ? `${selectedDealer.companyName} | ${selectedDealer.email}`
            : ''
        }
      />
      <CommandBar
        styles={commandBarStyles}
        items={_items}
        className="dealers__store__controls"
      />
      <ManageDealerForm
        formikReference={formikReference}
        dealerAccount={selectedDealer}
        submitAction={(args: any) => {
          let createAction = assignPendingActions(
            dealerActions.updateDealer(args),
            [
              dealerActions.setSelectedDealer(null),
              controlAction.closeInfoPanelWithComponent(),
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
