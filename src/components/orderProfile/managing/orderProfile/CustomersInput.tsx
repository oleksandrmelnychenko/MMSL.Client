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
import { List } from 'linq-typescript';

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

export const onRenderPartialDetail = (
  title: string,
  content: string | null | undefined
) => {
  let result = null;

  if (content && content.length > 0) {
    result = (
      <Stack horizontal tokens={{ childrenGap: 6 }}>
        <Text
          block
          styles={{
            root: { fontSize: '12px', color: '#a19f9d', marginTop: '2px' },
          }}
        >{`${title}:`}</Text>
        <Text
          block
          styles={{ root: { fontSize: '14px', color: 'rgb(50, 49, 48)' } }}
        >
          {content}
        </Text>
      </Stack>
    );
  }

  return result;
};

const _renderCustomerInfo = (customers: StoreCustomer[], formik: any) => {
  let result = null;

  if (formik.values.customer) {
    const selectedCustomer = new List<StoreCustomer>(customers).firstOrDefault(
      (customer) => customer.id === formik.values.customer.id
    );

    if (selectedCustomer) {
      const partialContents: any[] = [];

      partialContents.push(
        onRenderPartialDetail('Name', selectedCustomer.userName)
      );
      partialContents.push(
        onRenderPartialDetail('Email', selectedCustomer.email)
      );
      partialContents.push(
        onRenderPartialDetail('Store', selectedCustomer.store?.name)
      );
      partialContents.push(
        onRenderPartialDetail('Phone Number', selectedCustomer.phoneNumber)
      );

      if (partialContents.length > 0) {
        result = (
          <Stack tokens={{ childrenGap: 3 }}>
            {partialContents.map((partialContent, index) => (
              <Stack.Item key={index}>{partialContent}</Stack.Item>
            ))}
          </Stack>
        );
      }
    }
  }

  return result;
};

export const CustomersInput: React.FC<ICustomersInputProps> = (
  props: ICustomersInputProps
) => {
  return (
    <>
      {props.customers.length > 0 ? (
        <Stack>
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
                  // style={{ width: '260px' }}
                  required
                  options={_buildOptions(props.customers)}
                  errorMessage={
                    props.formik.errors.customer &&
                    props.formik.touched.customer
                      ? ' '
                      : ' '
                  }
                />
                {props.formik.errors.customer &&
                props.formik.touched.customer ? (
                  <span className="form__group__error ownError">
                    {props.formik.errors.customer}
                  </span>
                ) : null}
              </div>
            )}
          </Field>

          {/* {_renderCustomerInfo(props.customers, props.formik)} */}
        </Stack>
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
