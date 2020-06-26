import React, { useState, useEffect } from 'react';
import './dashboard.scss';
import { useSelector, useDispatch } from 'react-redux';
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
import { IApplicationState } from '../../redux/reducers';
import { DialogArgs, CommonDialogType } from '../../redux/slices/control.slice';
import { controlActions } from '../../redux/slices/control.slice';

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
              dialogArgs?.onSubmitClick();
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
              dialogArgs?.onSubmitClick();
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
              dialogArgs?.onDeclineClick();
            }}
            text="Cancel"
          />
        </DialogFooter>
      </>
    );
  };

  return (
    <div className="commonDialog">
      {dialogArgs ? (
        <Dialog
          minWidth={'500px'}
          hidden={isHidden}
          styles={{ main: { margin: '0' } }}
          onDismiss={() => {
            dispatch(controlActions.toggleCommonDialogVisibility(null));
            dialogArgs?.onDeclineClick();
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
          {dialogArgs?.dialogType === CommonDialogType.Common
            ? onRenderCommonDialog()
            : null}
          {dialogArgs?.dialogType === CommonDialogType.Delete
            ? onRenderDeleteDialog()
            : null}
        </Dialog>
      ) : null}
    </div>
  );
};

export default CommonDialog;
