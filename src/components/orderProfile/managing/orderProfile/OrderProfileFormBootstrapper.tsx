import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignPendingActions } from '../../../../helpers/action.helper';
import OrderProfileForm from './OrderProfileForm';
import { StoreCustomer } from '../../../../interfaces/storeCustomer';
import { customerActions } from '../../../../redux/slices/customer/customer.slice';
import { productActions } from '../../../../redux/slices/product.slice';
import { ProductCategory } from '../../../../interfaces/products';
import { CustomerProductProfile } from '../../../../interfaces/orderProfile';
import { IApplicationState } from '../../../../redux/reducers';

export const OrderProfileFormBootstrapper: React.FC = () => {
  const dispatch = useDispatch();

  const [customers, setCustomers] = useState<StoreCustomer[]>([]);
  const [isCustomersWasIntended, setIsCustomersWasIntended] = useState<boolean>(
    false
  );
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    []
  );
  const [
    isProductCategoriesWasIntended,
    setIsProductCategoriesWasIntended,
  ] = useState<boolean>(false);

  const targetOrderProfile:
    | CustomerProductProfile
    | null
    | undefined = useSelector<
    IApplicationState,
    CustomerProductProfile | null | undefined
  >((state) => state.orderProfile.targetOrderProfile);

  useEffect(() => {
    dispatch(
      assignPendingActions(
        customerActions.apigetAllCustomers(),
        [],
        [],
        (args: any) => {
          setIsCustomersWasIntended(true);
          setCustomers(args.entities);
        },
        (args: any) => {
          setIsCustomersWasIntended(true);
          setCustomers([]);
        }
      )
    );

    dispatch(
      assignPendingActions(
        productActions.apiGetAllProductCategories(),
        [],
        [],
        (args: any) => {
          setIsProductCategoriesWasIntended(true);
          setProductCategories(args);
        },
        (args: any) => {
          setIsProductCategoriesWasIntended(true);
          setProductCategories([]);
        }
      )
    );

    return () => {
      setIsCustomersWasIntended(false);
      setCustomers([]);
      setIsProductCategoriesWasIntended(false);
      setProductCategories([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isCustomersWasIntended && isProductCategoriesWasIntended ? (
        <OrderProfileForm
          isEditingOrderProfile={targetOrderProfile ? true : false}
          customers={customers}
          productCategories={productCategories}
        />
      ) : null}
    </>
  );
};

export default OrderProfileFormBootstrapper;
