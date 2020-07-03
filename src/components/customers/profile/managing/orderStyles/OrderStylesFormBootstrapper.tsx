import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { productActions } from '../../../../../redux/slices/product.slice';
import { CustomerProductProfile } from '../../../../../interfaces/orderProfile';
import { IApplicationState } from '../../../../../redux/reducers';
import OrderStylesForm from './OrderStylesForm';
import { ProductCategory } from '../../../../../interfaces/products';
import { controlActions } from '../../../../../redux/slices/control.slice';

export const OrderStylesFormBootstrapper: React.FC = () => {
  const dispatch = useDispatch();

  const [productCategory, setProductCategory] = useState<
    ProductCategory | null | undefined
  >(null);
  const [isCategoryWasIntended, setIsCategoryWasIntended] = useState<boolean>(
    false
  );

  const targetOrderProfile:
    | CustomerProductProfile
    | null
    | undefined = useSelector<
    IApplicationState,
    CustomerProductProfile | null | undefined
  >((state) => state.orderProfile.targetOrderProfile);

  useEffect(() => {
    if (targetOrderProfile) {
      dispatch(
        assignPendingActions(
          productActions.apiGetProductCategoryById(
            targetOrderProfile.productCategoryId
          ),
          [],
          [],
          (args: any) => {
            setIsCategoryWasIntended(true);
            setProductCategory(args);
          },
          (args: any) => {
            setIsCategoryWasIntended(true);
            setProductCategory(null);
          }
        )
      );
    } else {
      setIsCategoryWasIntended(false);
      setProductCategory(null);
    }

    return () => {
      setIsCategoryWasIntended(false);
      setProductCategory(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetOrderProfile]);

  return (
    <>
      {isCategoryWasIntended && productCategory ? (
        <OrderStylesForm productCategory={productCategory} />
      ) : null}
    </>
  );
};

export default OrderStylesFormBootstrapper;
