import React from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';
import { Stack, TextField } from 'office-ui-fabric-react';

import { FormicReference, StoreCustomer } from '../../interfaces';
import * as fabricStyles from '../../common/fabric-styles/styles';

interface IProps extends FormikProps<any> {
  props: any;
}

export const ReportsForm: React.FC<IProps> = (props) => {
  console.log(props, 'PROPS');
  return (
    <div>
      {/* {(props) => {
        return (
          <Form className="form">
            <div className="dealerFormManage">
              <Stack horizontal tokens={{ childrenGap: 20 }}>
                <Stack grow={1}>
                  <Field name="userName">
                    {() => (
                      <div className="form__group">
                        <TextField
                          value={props.formik.values.userName}
                          styles={fabricStyles.textFildLabelStyles}
                          className="form__group__field"
                          label="User name"
                          required
                          onChange={(args: any) => {
                            let value = args.target.value;

                            props.formik.setFieldValue('userName', value);
                            props.formik.setFieldTouched('userName');
                          }}
                          errorMessage={
                            props.formik.errors.userName &&
                            props.formik.touched.userName ? (
                              <span className="form__group__error">
                                {props.formik.errors.userName}
                              </span>
                            ) : (
                              ''
                            )
                          }
                        />
                      </div>
                    )}
                  </Field>
                </Stack>
              </Stack>
            </div>
          </Form>
        );
      }} */}
    </div>
  );
};

export default ReportsForm;
