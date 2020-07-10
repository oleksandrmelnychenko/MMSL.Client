import React, { useState } from 'react';
import ManageDealerForm from './managing/dealerManaging/ManageDealerForm';
import { useSelector } from 'react-redux';
import { FormicReference } from '../../interfaces';
import { DealerAccount } from '../../interfaces/dealer';
import { IApplicationState } from '../../redux/reducers';
import PanelTitle from '../../common/panel/PanelTitle';
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
            ? [selectedDealer.companyName, selectedDealer.email]
            : null
        }
      />
      <CommandBar
        styles={commandBarStyles}
        items={_items}
        className="dealers__store__controls"
      />
      <ManageDealerForm />
    </div>
  );
};

export default DealerDetails;
