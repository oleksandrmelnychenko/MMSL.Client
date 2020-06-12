import React from 'react';
import { Field } from 'formik';
import {
  Stack,
  FontIcon,
  mergeStyles,
  DefaultButton,
} from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../common/fabric-styles/styles';

const _onRenderThumb = (thumbUrl: string) => {
  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid #efefef',
        padding: '6px',
        borderRadius: '6px',
      }}
    >
      <FontIcon
        style={{
          position: 'absolute',
          top: 'calc(50% - 18px)',
          left: 'calc(50% - 12px)',
          zIndex: 0,
        }}
        iconName="FileImage"
        className={mergeStyles({
          fontSize: 24,
          width: 24,
          color: '#cfcfcf',
        })}
      />
      <img
        style={{
          display: 'block',
          position: 'relative',
          zIndex: 1,
          margin: '0 auto',
        }}
        width="300px"
        height="300px"
        alt=""
        src={thumbUrl}
      />
    </div>
  );
};

export interface IAttachFieldProps {
  formik: any;
}

export const AttachField: React.FC<IAttachFieldProps> = (
  props: IAttachFieldProps
) => {
  const fileInputRef: any = React.createRef();

  let thumbUrl: string = '';

  if (props.formik) {
    if (props.formik.values.isRemovingImage) {
      if (props.formik.values.unitToDelete) {
        if (props.formik.values.imageFile) {
          thumbUrl = URL.createObjectURL(props.formik.values.imageFile);
        } else {
          thumbUrl = props.formik.values.unitToDelete.imageUrl;
        }
      } else {
        if (props.formik.values.imageFile) {
          thumbUrl = URL.createObjectURL(props.formik.values.imageFile);
        }
      }
    }
  }

  return (
    <Field name="imageFile">
      {() => {
        return (
          <div className="form__group">
            <Stack tokens={{ childrenGap: 10 }}>
              <div style={{ position: 'relative' }}>
                <input
                  accept="image/*"
                  ref={fileInputRef}
                  style={{
                    height: '1px',
                    width: '1px',
                    position: 'absolute',
                  }}
                  type="file"
                  onChange={(args: any) => {
                    let file = args.currentTarget.files;
                    if (file && file.length && file.length > 0) {
                      props.formik.setFieldValue('imageFile', file[0]);
                      props.formik.setFieldValue('isRemovingImage', true);

                      args.currentTarget.value = '';
                    }
                  }}
                />
                <DefaultButton
                  iconProps={{ iconName: 'Attach' }}
                  styles={fabricStyles.btnUploadStyle}
                  text={
                    props.formik.values.isRemovingImage
                      ? 'Delete attach'
                      : 'Attach'
                  }
                  onClick={() => {
                    const clearInputFileFlow = () => {
                      if (fileInputRef && fileInputRef.current) {
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                          props.formik.setFieldValue('imageFile', null);
                          props.formik.setFieldValue('isRemovingImage', false);
                        }
                      }
                    };

                    const addInputFileFlow = () => {
                      if (fileInputRef && fileInputRef.current) {
                        if (fileInputRef.current && document.createEvent) {
                          let evt = document.createEvent('MouseEvents');
                          evt.initEvent('click', true, false);
                          fileInputRef.current.dispatchEvent(evt);
                        }
                      }
                    };

                    if (props.formik.values.isRemovingImage) {
                      clearInputFileFlow();
                    } else {
                      if (props.formik.values.imageFile) {
                        clearInputFileFlow();
                      } else {
                        addInputFileFlow();
                      }
                    }
                  }}
                  allowDisabledFocus
                />
              </div>

              {props.formik.values.isRemovingImage
                ? _onRenderThumb(thumbUrl)
                : null}
            </Stack>
          </div>
        );
      }}
    </Field>
  );
};

export default AttachField;
