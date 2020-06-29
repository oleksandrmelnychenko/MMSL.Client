import React, { useState, useEffect } from 'react';
import { Stack, Text, TextField } from 'office-ui-fabric-react';
import './valueItem.scss';
import { Field } from 'formik';

export interface IInputValueModel {
  value: string;
  fittingValue: string;
  measurementDefinitionId: number;
  definitionName: string;
  id: number;
}

export interface IValueItemProps {
  formik: any;
  valueModel: IInputValueModel;
  fieldName: string;
  index: number;
}

export const ValueItem: React.FC<IValueItemProps> = (
  props: IValueItemProps
) => {
  const [initInput, setInitInput] = useState<string>('');

  if (props.valueModel.value !== initInput) {
    setInitInput(props.valueModel.value);
  }

  useEffect(() => {
    setInitInput(props.valueModel.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Field name={`${props.fieldName}.${props.index}`}>
        {() => (
          <div
            className={
              initInput !== props.formik.values.TEST[props.index].value
                ? 'valueItem isDirty'
                : 'valueItem'
            }
          >
            <Stack horizontal horizontalAlign="space-between">
              <Stack.Item
                styles={{
                  root: {
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              >
                <Text>{props.valueModel.definitionName}</Text>
              </Stack.Item>
              <Stack.Item>
                <div className="valueItem__editNameInput">
                  <TextField
                    type="number"
                    borderless
                    value={props.formik.values.TEST[props.index].value}
                    onChange={(args: any) => {
                      props.formik.setFieldValue(
                        `${props.fieldName}[${props.index}].value`,
                        args.target.value
                      );
                      props.formik.setFieldTouched(props.fieldName);
                    }}
                  />
                </div>
              </Stack.Item>
            </Stack>
          </div>
        )}
      </Field>
    </>
  );
};

export default ValueItem;
