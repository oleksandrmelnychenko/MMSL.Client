import React, { useState } from 'react';
import '../dashboard.scss';
import { useDispatch } from 'react-redux';
import { Modal } from 'office-ui-fabric-react';
import {
  IDialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import { controlActions } from '../../../redux/slices/control.slice';

export interface IModalViewProps {
  dialogArgs: IDialogArgs;
}

const ModalView: React.FC<IModalViewProps> = (props: IModalViewProps) => {
  const dispatch = useDispatch();

  const [isHidden] = useState<boolean>();

  const onRenderContentDialog = (content: any) => {
    return <>{content}</>;
  };

  return (
    <>
      {props.dialogArgs.dialogType === CommonDialogType.Content ? (
        <Modal
          titleAriaId={''}
          isOpen={!isHidden}
          onDismiss={() => {
            dispatch(controlActions.toggleCommonDialogVisibility(null));
            props.dialogArgs.onDeclineClick();
          }}
          isBlocking={false}
        >
          {onRenderContentDialog(props.dialogArgs.viewContent)}
        </Modal>
      ) : null}
    </>
  );
};

export default ModalView;
