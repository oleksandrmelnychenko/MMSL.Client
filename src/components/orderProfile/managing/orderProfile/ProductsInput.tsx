import React from 'react';
import { Field } from 'formik';
import {
  IDropdownOption,
  ComboBox,
  Text,
  IComboBoxOption,
  Stack,
  FontIcon,
  mergeStyles,
} from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../common/fabric-styles/styles';
import { ProductCategory } from '../../../../interfaces/products';

export interface IProductsInputProps {
  products: ProductCategory[];
  formik: any;
}

const _buildOptions = (products: ProductCategory[]) => {
  return products.map((product: ProductCategory, index: number) => {
    return {
      key: `${product.id}`,
      text: product.name,
      // isSelected: index === 0,
      product: product,
    } as IDropdownOption;
  });
};

export const ProductsInput: React.FC<IProductsInputProps> = (
  props: IProductsInputProps
) => {
  return (
    <>
      {props.products.length > 0 ? (
        <Field name="productCategory">
          {() => (
            <div className="form__group">
              <ComboBox
                useComboBoxAsMenuWidth={true}
                className="form__group__comboBox"
                text={
                  props.formik.values.productCategory
                    ? props.formik.values.productCategory.name
                    : ''
                }
                label="Product"
                selectedKey={
                  props.formik.values.productCategory
                    ? `${props.formik.values.productCategory.id}`
                    : ''
                }
                allowFreeform
                onChange={(
                  event: any,
                  option?: IComboBoxOption,
                  index?: number,
                  value?: string
                ) => {
                  if (option && (option as any).product) {
                    props.formik.setFieldValue(
                      'productCategory',
                      (option as any).product
                    );
                    props.formik.setFieldTouched('productCategory');
                  } else {
                    props.formik.setFieldValue('productCategory', null);
                    props.formik.setFieldTouched('productCategory');
                  }
                }}
                styles={fabricStyles.comboBoxStyles}
                required
                options={_buildOptions(props.products)}
                errorMessage={
                  props.formik.errors.productCategory &&
                  props.formik.touched.productCategory
                    ? ' '
                    : ' '
                }
              />
              {props.formik.errors.productCategory &&
              props.formik.touched.productCategory ? (
                <span className="form__group__error ownError">
                  {props.formik.errors.productCategory}
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
              {
                "You don't have any available products. Contact to your manufacturer."
              }
            </Text>
          </Stack>
        </div>
      )}
    </>
  );
};

export default ProductsInput;
