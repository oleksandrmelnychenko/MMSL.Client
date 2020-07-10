import React from 'react';
import { Field } from 'formik';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react';
import { dateToString } from '../../helpers/date.helper';
import * as fabricStyles from '../fabric-styles/styles';
import * as fabricControlSettings from '../fabric-control-settings/fabricControlSettings';

export interface IFormDatePickerProps {
  formik: any;
  fieldName: string;
  label: string;
}

export const FormDatePicker: React.FC<IFormDatePickerProps> = (
  props: IFormDatePickerProps
) => {
  return (
    <Field name={props.fieldName}>
      {() => (
        <div className="form__group">
          <DatePicker
            formatDate={fabricControlSettings.onFormatDate}
            firstDayOfWeek={DayOfWeek.Monday}
            strings={fabricControlSettings.dayPickerStrings}
            textField={fabricStyles.datePickerStyles}
            value={
              props.formik.values[props.fieldName]
                ? new Date(props.formik.values[props.fieldName])
                : undefined
            }
            label={props.label}
            allowTextInput={true}
            showGoToToday={false}
            onSelectDate={(date: Date | null | undefined) => {
              props.formik.setFieldValue(props.fieldName, dateToString(date));
              props.formik.setFieldTouched(props.fieldName);
            }}
          />
        </div>
      )}
    </Field>
  );
};

export default FormDatePicker;
