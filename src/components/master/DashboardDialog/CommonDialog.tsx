import React from 'react';
import '../dashboard.scss';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import {
  IDialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import DialogView from './DialogView';
import ModalView from './ModalView';

const _renderCommonDialogContent = (dialogArgs: IDialogArgs | null) => {
  let result: any = null;

  if (dialogArgs) {
    if (
      dialogArgs.dialogType === CommonDialogType.Common ||
      dialogArgs.dialogType === CommonDialogType.Delete
    ) {
      result = <DialogView dialogArgs={dialogArgs} />;
    } else if (dialogArgs.dialogType === CommonDialogType.Content) {
      result = <ModalView dialogArgs={dialogArgs} />;
    }
  }

  return result;
};

const CommonDialog: React.FC = () => {
  const dialogArgs: IDialogArgs | null = useSelector<
    IApplicationState,
    IDialogArgs | null
  >((state) => state.control.commonDialog.dialogArgs);

  return (
    <div className="commonDialog">{_renderCommonDialogContent(dialogArgs)}</div>
  );
};

export default CommonDialog;
