import React, { useState, useEffect } from 'react';
import '../dashboard.scss';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  Text,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  DialogType,
  Stack,
  FontIcon,
  mergeStyles,
} from 'office-ui-fabric-react';
import {
  IDialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import { controlActions } from '../../../redux/slices/control.slice';

export interface IDialogViewProps {
  dialogArgs: IDialogArgs;
}

const DialogView: React.FC<IDialogViewProps> = (props: IDialogViewProps) => {
  const dispatch = useDispatch();

  const [isHidden, setIsHidden] = useState<boolean>();
  const [title, setTitle] = useState<string>();
  const [subText, setSubText] = useState<string>();

  useEffect(() => {
    setIsHidden(props.dialogArgs ? false : true);

    if (props.dialogArgs) {
      setTitle(props.dialogArgs.title);
      setSubText(props.dialogArgs.subText);
    }
  }, [props.dialogArgs]);

  const onRenderCommonDialog = () => {
    return (
      <>
        <Stack horizontal tokens={{ childrenGap: 9 }}>
          <FontIcon
            style={{ cursor: 'default' }}
            iconName="Info"
            className={mergeStyles({
              fontSize: '32px',
              color: '#2b579a',
            })}
          />
          <Stack verticalAlign="center">
            <Text styles={{ root: { fontSize: '14px' } }}>{subText}</Text>
          </Stack>
        </Stack>
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              dispatch(controlActions.toggleCommonDialogVisibility(null));
              props.dialogArgs?.onSubmitClick();
            }}
            text="Ok"
          />
        </DialogFooter>
      </>
    );
  };

  const onRenderDeleteDialog = () => {
    return (
      <>
        <Stack horizontal tokens={{ childrenGap: 9 }}>
          <FontIcon
            style={{ cursor: 'default' }}
            iconName="WarningSolid"
            className={mergeStyles({
              fontSize: '32px',
              color: 'rgba(214,127,60,1)',
            })}
          />
          <Stack verticalAlign="center">
            <Text styles={{ root: { fontSize: '14px' } }}>{subText}</Text>
          </Stack>
        </Stack>
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              dispatch(controlActions.toggleCommonDialogVisibility(null));
              props.dialogArgs?.onSubmitClick();
            }}
            text="Permanently delete"
          />
          <DefaultButton
            styles={{
              root: {
                color: 'rgb(80, 80, 80)',
                borderColor: 'transparent',
                backgroundColor: '#f3f2f1',
              },
              rootHovered: {
                backgroundColor: '#edebe9',
              },
            }}
            onClick={() => {
              dispatch(controlActions.toggleCommonDialogVisibility(null));
              props.dialogArgs?.onDeclineClick();
            }}
            text="Cancel"
          />
        </DialogFooter>
      </>
    );
  };

  return (
    <>
      <Dialog
        minWidth={'500px'}
        hidden={isHidden}
        styles={{ main: { margin: '0' } }}
        onDismiss={() => {
          dispatch(controlActions.toggleCommonDialogVisibility(null));
          props.dialogArgs.onDeclineClick();
        }}
        modalProps={{ isDarkOverlay: true }}
        dialogContentProps={{
          type: DialogType.normal,
          title: (
            <Text
              styles={{
                root: {
                  fontWeight: 100,
                  fontSize: '24px',
                  color: 'rgb(80, 80, 80)',
                },
              }}
            >
              {title}
            </Text>
          ),
          showCloseButton: true,
        }}
      >
        {props.dialogArgs.dialogType === CommonDialogType.Common
          ? onRenderCommonDialog()
          : null}
        {props.dialogArgs.dialogType === CommonDialogType.Delete
          ? onRenderDeleteDialog()
          : null}
      </Dialog>
    </>
  );
};

export default DialogView;
