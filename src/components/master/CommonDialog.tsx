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
import { DialogArgs, CommonDialogType } from '../../redux/slices/control';
import { controlActions } from '../../redux/slices/control';

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

    if (dialogArgs) {
      setTitle(dialogArgs.title);
      setSubText(dialogArgs.subText);
    }
  }, [dialogArgs]);

  return (
    <>
      {dialogArgs ? (
        <Dialog
          hidden={isHidden}
          onDismiss={() => {}}
          dialogContentProps={{
            type: DialogType.normal,
            title: title,
            subText: subText,
          }}>
          {dialogArgs?.dialogType === CommonDialogType.Common ? (
            <DialogFooter>
              <PrimaryButton
                onClick={() => {
                  dispatch(controlActions.toggleCommonDialogVisibility(null));
                  dialogArgs?.onSubmitClick();
                }}
                text="Ok"
              />
            </DialogFooter>
          ) : null}
          {dialogArgs?.dialogType === CommonDialogType.Delete ? (
            <DialogFooter>
              <PrimaryButton
                onClick={() => {
                  dispatch(controlActions.toggleCommonDialogVisibility(null));
                  dialogArgs?.onSubmitClick();
                }}
                text="Ok"
              />
              <DefaultButton
                onClick={() => {
                  dispatch(controlActions.toggleCommonDialogVisibility(null));
                  dialogArgs?.onDeclineClick();
                }}
                text="Cancel"
              />
            </DialogFooter>
          ) : null}
        </Dialog>
      ) : null}
    </>
  );
};

export default CommonDialog;
