import React, { useState } from 'react';
import ManageDealerForm from './dealerManaging/ManageDealerForm';
import { dealerActions } from '../../redux/slices/dealer.slice';
import { controlActions } from '../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import { assignPendingActions } from '../../helpers/action.helper';
import { DealerAccount, FormicReference } from '../../interfaces';
import { IApplicationState } from '../../redux/reducers';
import { ToggleDealerPanelWithDetails } from '../../redux/slices/dealer.slice';
import PanelTitle from './panel/PanelTitle';
import './dealerDetails.scss';
import {
  ICommandBarItemProps,
  CommandBar,
  Separator,
} from 'office-ui-fabric-react';
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
        description={[selectedDealer.companyName, selectedDealer.email]}
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
              controlActions.closeInfoPanelWithComponent(),
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
