import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileManagingActions } from '../../../../../redux/slices/customer/orderProfile/profileManaging.slice';
import { Measurement } from '../../../../../interfaces/measurements';
import { IApplicationState } from '../../../../../redux/reducers';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { productActions } from '../../../../../redux/slices/product.slice';
import ProfileForm from './ProfileForm';
import { ProductCategory } from '../../../../../interfaces/products';
import { StoreCustomer } from '../../../../../interfaces/storeCustomer';

export const ProfileFormBootstrapper: React.FC = () => {
  const dispatch = useDispatch();

  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isMeasurementsWasIntended, setIsMeasurementsWasIntended] = useState<
    boolean
  >(false);

  const [productCategory, setProductCategory] = useState<
    ProductCategory | null | undefined
  >(null);
  const [isCategoryWasIntended, setIsCategoryWasIntended] = useState<boolean>(
    false
  );

  // const { customer, product }: any = useSelector<IApplicationState, any>(
  //   (state) => state.profileManaging.
  // );
  const customer: StoreCustomer | null | undefined = useSelector<
    IApplicationState,
    StoreCustomer | null | undefined
  >((state) => state.profileManaging.customer);

  const productId: number = useSelector<IApplicationState, number>(
    (state) => state.profileManaging.productId
  );

  useEffect(() => {
    return () => {
      dispatch(profileManagingActions.stopManaging());

      setMeasurements([]);
      setIsMeasurementsWasIntended(false);

      setProductCategory(null);
      setIsCategoryWasIntended(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (productId > 0) {
      dispatch(
        assignPendingActions(
          productActions.apiGetAllProductMeasurementsByProductId(productId),
          [],
          [],
          (args: any) => {
            setIsMeasurementsWasIntended(true);
            setMeasurements(args);
          },
          (args: any) => {
            setIsMeasurementsWasIntended(true);
            setMeasurements([]);
          }
        )
      );

      dispatch(
        assignPendingActions(
          productActions.apiGetProductCategoryById(productId),
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
      setIsMeasurementsWasIntended(false);
      setMeasurements([]);
    }

    return () => {
      setIsMeasurementsWasIntended(false);
      setMeasurements([]);

      setIsCategoryWasIntended(false);
      setProductCategory(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  console.log(isMeasurementsWasIntended);
  console.log(isCategoryWasIntended);
  console.log(productCategory);
  return (
    <div className="formBootstrapper">
      {isMeasurementsWasIntended &&
      isCategoryWasIntended &&
      productCategory &&
      customer ? (
        <ProfileForm
          measurements={measurements}
          product={productCategory}
          customer={customer}
        />
      ) : null}
    </div>
  );
};

export default ProfileFormBootstrapper;
