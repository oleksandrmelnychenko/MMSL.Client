import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ProductCategory } from '../../../../interfaces/products';
import { IApplicationState } from '../../../../redux/reducers';
import { ComboBox, IComboBox } from 'office-ui-fabric-react';
import './productsStack.scss';
import { orderProfileActions } from '../../../../redux/slices/customer/orderProfile/orderProfile.slice';
import { List } from 'linq-typescript';
import * as fabricStyles from '../../../../common/fabric-styles/styles';

export interface IProductsStackProps {}

export const ProductsStack: React.FC<IProductsStackProps> = (
  props: IProductsStackProps
) => {
  const dispatch = useDispatch();

  const customerProductProfiles: ProductCategory[] = useSelector<
    IApplicationState,
    ProductCategory[]
  >((state) => state.orderProfile.customerProductProfiles);

  const selectedProductProfile:
    | ProductCategory
    | null
    | undefined = useSelector<
    IApplicationState,
    ProductCategory | null | undefined
  >((state) => state.orderProfile.selectedProductProfiles);

  useEffect(() => {
    if (!selectedProductProfile && customerProductProfiles.length > 0) {
      dispatch(
        orderProfileActions.changeSelectedProductProfiles(
          customerProductProfiles[0]
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductProfile, customerProductProfiles]);

  const itemOptions = new List(customerProductProfiles)
    .select((product) => {
      let text = product.name;

      return {
        key: `${product.id}`,
        text: text,
        product: product,
      };
    })
    .toArray();

  return (
    <div className="productsStack">
      <ComboBox
        selectedKey={
          selectedProductProfile ? `${selectedProductProfile.id}` : ''
        }
        placeholder="Coose product"
        label="Product"
        options={itemOptions}
        allowFreeform
        styles={{
          ...fabricStyles.comboBoxStyles,
          label: { ...fabricStyles.comboBoxStyles.label, paddingTop: '0px' },
        }}
        style={{ width: '212px' }}
        useComboBoxAsMenuWidth
        onChange={(
          event: React.FormEvent<IComboBox>,
          option?: any,
          index?: number,
          value?: string
        ) => {
          if (option) {
            dispatch(
              orderProfileActions.changeSelectedProductProfiles(option.product)
            );
          }
        }}
      />
    </div>
  );
};

export default ProductsStack;
