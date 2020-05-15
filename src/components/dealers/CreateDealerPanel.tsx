import React, { useState } from 'react';
import './createDealerPanel.scss';
import {
  ActionButton,
  Stack,
  Panel,
  PanelType,
  Text,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import * as dealerActions from '../../redux/actions/dealer.actions';
import ManageDealerForm, { FormicReference } from './ManageDealerForm';
import { assignPendingActions } from '../../helpers/action.helper';
import PanelTitle from './PanelTitle';

export const CreateDealerPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const isAddDealerOpen = useSelector<IApplicationState, boolean>(
    (state) => state.dealer.manageDealerForm.isFormVisible
  );

  const [formikReference] = useState<FormicReference>(new FormicReference());

  return (
    <div className="createDealerPanel">
      <Panel
        isOpen={isAddDealerOpen}
        type={PanelType.custom}
        customWidth={'600px'}
        onDismiss={() => {
          dispatch(dealerActions.toggleNewDealerForm(false));
        }}
        onRenderHeader={() => {
          return (
            <PanelTitle
              onSaveClick={() => {
                let formik: any = formikReference.formik;

                if (formik !== undefined && formik !== null) {
                  formik.submitForm();
                }
              }}
              title={'New Dealer'}
            />
          );
        }}
        closeButtonAriaLabel="Close"
      >
        <ManageDealerForm
          formikReference={formikReference}
          submitAction={(args: any) => {
            let createAction = assignPendingActions(
              dealerActions.saveNewDealer(args),
              [
                dealerActions.getDealersListPaginated(),
                dealerActions.toggleNewDealerForm(false),
              ]
            );
            dispatch(createAction);
          }}
        />
      </Panel>
    </div>
  );
};

export default CreateDealerPanel;
