import React from 'react';
import { Field } from 'formik';
import {
  IDropdownOption,
  ComboBox,
  IComboBoxOption,
  FontIcon,
  Text,
  Stack,
  mergeStyles,
} from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../common/fabric-styles/styles';
import { StoreCustomer } from '../../../../interfaces/storeCustomer';

export interface ICustomersInputProps {
  customers: StoreCustomer[];
  formik: any;
}

const _buildOptions = (customers: StoreCustomer[]) => {
  return customers.map((customer: StoreCustomer, index: number) => {
    return {
      key: `${customer.id}`,
      text: customer.customerName,
      // isSelected: index === 0,
      customer: customer,
    } as IDropdownOption;
  });
};

export const CustomersInput: React.FC<ICustomersInputProps> = (
  props: ICustomersInputProps
) => {
  return (
    <>
      {props.customers.length > 0 ? (
        <Field name="customer">
          {() => (
            <div className="form__group">
              <ComboBox
                useComboBoxAsMenuWidth={true}
                className="form__group__comboBox"
                text={
                  props.formik.values.customer
                    ? props.formik.values.customer.customerName
                    : ''
                }
                label="Customer"
                selectedKey={
                  props.formik.values.customer
                    ? `${props.formik.values.customer.id}`
                    : ''
                }
                allowFreeform
                onChange={(
                  event: any,
                  option?: IComboBoxOption,
                  index?: number,
                  value?: string
                ) => {
                  if (option && (option as any).customer) {
                    props.formik.setFieldValue(
                      'customer',
                      (option as any).customer
                    );
                    props.formik.setFieldTouched('customer');
                  } else {
                    props.formik.setFieldValue('customer', null);
                    props.formik.setFieldTouched('customer');
                  }
                }}
                styles={fabricStyles.comboBoxStyles}
                required
                options={_buildOptions(props.customers)}
                errorMessage={
                  props.formik.errors.customer && props.formik.touched.customer
                    ? ' '
                    : ' '
                }
              />
              {props.formik.errors.customer && props.formik.touched.customer ? (
                <span className="form__group__error ownError">
                  {props.formik.errors.customer}
                </span>
              ) : null}
            </div>
          )}
        </Field>
      ) : (
        <div
          style={{
            marginTop: '20px',
            padding: '6px 6px',
            backgroundColor: 'rgb(240, 240, 240)',
          }}
        >
          <Stack horizontal tokens={{ childrenGap: '6px' }}>
            <FontIcon
              style={{ cursor: 'default' }}
              iconName="Warning"
              className={mergeStyles({
                fontSize: 16,
                position: 'relative',
                top: '-3px',
                color: 'rgba(214,127,60,1)',
              })}
            />
            <Text block>
              {"You don't have any known customers. Add customer first."}
            </Text>
          </Stack>
        </div>
      )}
    </>
  );
};

export default CustomersInput;
