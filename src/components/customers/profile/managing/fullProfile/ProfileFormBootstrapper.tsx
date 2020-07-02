import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileManagingActions } from '../../../../../redux/slices/customer/orderProfile/profileManaging.slice';
import { Measurement } from '../../../../../interfaces/measurements';
import { IApplicationState } from '../../../../../redux/reducers';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { productActions } from '../../../../../redux/slices/product.slice';
import ProfileForm from './ProfileForm';
import { ProductCategory } from '../../../../../interfaces/products';

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

  const { customer, product }: any = useSelector<IApplicationState, any>(
    (state) => state.profileManaging
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
    if (product) {
      dispatch(
        assignPendingActions(
          productActions.apiGetAllProductMeasurementsByProductId(product.id),
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
          productActions.apiGetProductCategoryById(product.id),
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
  }, [product]);

  return (
    <>
      {isMeasurementsWasIntended && isCategoryWasIntended && productCategory ? (
        <ProfileForm
          measurements={measurements}
          product={productCategory}
          customer={customer}
        />
      ) : null}
    </>
  );
};

export default ProfileFormBootstrapper;
