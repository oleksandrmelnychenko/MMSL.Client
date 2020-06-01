import React, { useState } from 'react';
import './createDealerPanel.scss';
import {
  Panel,
  PanelType,
  CommandBar,
  ICommandBarItemProps,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { dealerActions } from '../../../redux/slices/dealer.slice';
import ManageDealerForm from './ManageDealerForm';
import { assignPendingActions } from '../../../helpers/action.helper';
import PanelTitle from '../panel/PanelTitle';
import {
  panelStyle,
  commandBarStyles,
  commandBarButtonStyles,
} from '../../../common/fabric-styles/styles';
import { FormicReference } from '../../../interfaces';

export const CreateDealerPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = (isDirty: boolean) => {
        setIsDirtyForm(isDirty);
      };
    })
  );
  const [isDirtyForm, setIsDirtyForm] = useState(false);

  const isAddDealerOpen = useSelector<IApplicationState, boolean>(
    (state) => state.dealer.manageDealerForm.isFormVisible
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
    <div className="createDealerPanel">
      <Panel
        styles={panelStyle}
        isOpen={isAddDealerOpen}
        type={PanelType.custom}
        customWidth={'600px'}
        onDismiss={() => {
          dispatch(dealerActions.toggleNewDealerForm(false));
        }}
        closeButtonAriaLabel="Close">
        <PanelTitle title={'New Dealer'} />
        <CommandBar
          styles={commandBarStyles}
          items={_items}
          className="dealers__store__controls"
        />
        <ManageDealerForm
        // formikReference={formikReference}
        // submitAction={(args: any) => {
        //   let createAction = assignPendingActions(
        //     dealerActions.saveNewDealer(args),
        //     [
        //       dealerActions.getDealersListPaginated(),
        //       dealerActions.toggleNewDealerForm(false),
        //     ]
        //   );
        //   dispatch(createAction);
        // }}
        />
      </Panel>
    </div>
  );
};

export default CreateDealerPanel;
