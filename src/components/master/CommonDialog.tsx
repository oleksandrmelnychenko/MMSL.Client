import React, { useState, useEffect } from 'react';
import './dashboard.scss';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  DialogType,
} from 'office-ui-fabric-react';
import { IApplicationState } from '../../redux/reducers';
import { DialogArgs } from '../../redux/reducers/control.reducer';
import * as controlAction from '../../redux/actions/control.actions';

const CommonDialog: React.FC = () => {
  const dispatch = useDispatch();
  const [isHidden, setIsHidden] = useState<boolean>();
  const [title, setTitle] = useState<string>();
  const [subText, setSubText] = useState<string>();

  const dialogArgs: DialogArgs | null = useSelector<
    IApplicationState,
    DialogArgs | null
  >((state) => state.control.commonDialog.dialogArgs);

  useEffect(() => {
    setIsHidden(dialogArgs ? false : true);
    console.log(dialogArgs);

    if (dialogArgs) {
      setTitle(dialogArgs.title);
      setSubText(dialogArgs.subText);
    }
  }, [dialogArgs]);

  return (
    <>
      <Dialog
        hidden={isHidden}
        onDismiss={() => {}}
        dialogContentProps={{
          type: DialogType.normal,
          title: title,
          subText: subText,
        }}
      >
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              dispatch(controlAction.toggleCommonDialogVisibility(null));

              setTimeout(() => {
                dialogArgs?.onSubmitClick();
              }, 500);
            }}
            text="Ok"
          />
          <DefaultButton
            onClick={() => {
              dispatch(controlAction.toggleCommonDialogVisibility(null));

              setTimeout(() => {
                dialogArgs?.onDeclineClick();
              }, 500);
            }}
            text="Cancel"
          />
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default CommonDialog;
