import React from 'react';
import './dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  DialogType,
} from 'office-ui-fabric-react';
import * as controlAction from '../../redux/actions/control.actions';
import { IApplicationState } from '../../redux/reducers';

const CommonDialog: React.FC = () => {
  const dispatch = useDispatch();

  const isDialogOpen: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.control.commonDialog.isDialogOpen
  );

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Missing Subject',
    closeButtonAriaLabel: 'Close',
    subText: 'Do you want to send this message without a subject?',
  };

  return (
    <>
      <Dialog
        hidden={!isDialogOpen}
        onDismiss={() => {}}
        dialogContentProps={dialogContentProps}
      >
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              dispatch(controlAction.toggleCommonDialogVisibility(false));
            }}
            text="Send"
          />
          <DefaultButton
            onClick={() => {
              dispatch(controlAction.toggleCommonDialogVisibility(false));
            }}
            text="Don't send"
          />
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default CommonDialog;
