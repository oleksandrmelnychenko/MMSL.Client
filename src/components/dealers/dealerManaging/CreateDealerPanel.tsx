import React, { useState } from 'react';
import './createDealerPanel.scss';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import * as dealerActions from '../../../redux/actions/dealer.actions';
import ManageDealerForm, { FormicReference } from './ManageDealerForm';
import { assignPendingActions } from '../../../helpers/action.helper';
import PanelTitle from '../panel/PanelTitle';
import PanelFooter from '../panel/PanelFooter';
import { panelStyle } from '../../../common/fabric-styles/styles';

export const CreateDealerPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const isAddDealerOpen = useSelector<IApplicationState, boolean>(
    (state) => state.dealer.manageDealerForm.isFormVisible
  );

  const [formikReference] = useState<FormicReference>(new FormicReference());

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
        <PanelTitle
          onSaveClick={() => {
            let formik: any = formikReference.formik;

            if (formik !== undefined && formik !== null) {
              formik.submitForm();
            }
          }}
          title={'New Dealer'}
        />
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
        <PanelFooter
          onSaveClick={() => {
            let formik: any = formikReference.formik;

            if (formik !== undefined && formik !== null) {
              formik.submitForm();
            }
          }}
        />
      </Panel>
    </div>
  );
};

export default CreateDealerPanel;
