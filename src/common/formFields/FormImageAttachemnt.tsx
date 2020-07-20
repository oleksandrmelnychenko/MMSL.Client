import React from 'react';
import { Field } from 'formik';
import {
  FontIcon,
  mergeStyles,
  Stack,
  DefaultButton,
} from 'office-ui-fabric-react';
import * as fabricStyles from '../fabric-styles/styles';

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

export interface IFormImageAttachemntProps {
  formik: any;
  sourceImageURL: string;
  fieldName: string;
}

export const FormImageAttachemnt: React.FC<IFormImageAttachemntProps> = (
  props: IFormImageAttachemntProps
) => {
  const fileInputRef: any = React.createRef();

  let thumbUrl: string = props.sourceImageURL;

  if (props.formik.values[props.fieldName]) {
    thumbUrl = URL.createObjectURL(props.formik.values[props.fieldName]);
  }

  const isHaveURL: boolean = thumbUrl && thumbUrl.length > 0 ? true : false;

  console.log(isHaveURL);

  return (
    <Field name={props.fieldName}>
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
                      props.formik.setFieldValue(props.fieldName, file[0]);
                      props.formik.setFieldTouched(props.fieldName);

                      args.currentTarget.value = '';
                    }
                  }}
                />
                <DefaultButton
                  iconProps={{ iconName: 'Attach' }}
                  styles={fabricStyles.btnUploadStyle}
                  text={isHaveURL ? 'Delete attach' : 'Attach'}
                  onClick={() => {
                    const clearInputFileFlow = () => {
                      if (fileInputRef && fileInputRef.current) {
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                          props.formik.setFieldValue(props.fieldName, null);
                          props.formik.setFieldTouched(props.fieldName);
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

                    if (isHaveURL) {
                      clearInputFileFlow();
                    } else {
                      addInputFileFlow();
                    }
                  }}
                  allowDisabledFocus
                />
              </div>

              {isHaveURL ? _onRenderThumb(thumbUrl) : null}
            </Stack>
          </div>
        );
      }}
    </Field>
  );
};

export default FormImageAttachemnt;
