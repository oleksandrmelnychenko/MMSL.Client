import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileManagingActions } from '../../../../../redux/slices/customer/orderProfile/profileManaging.slice';
import { Measurement } from '../../../../../interfaces/measurements';
import { IApplicationState } from '../../../../../redux/reducers';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { productActions } from '../../../../../redux/slices/product.slice';
import ProfileForm from './ProfileForm';

export const ProfileFormBootstrapper: React.FC = () => {
  const dispatch = useDispatch();

  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isMeasurementsWasIntended, setIsMeasurementsWasIntended] = useState<
    boolean
  >(false);

  const { customer, product }: any = useSelector<IApplicationState, any>(
    (state) => state.profileManaging
  );

  useEffect(() => {
    return () => {
      dispatch(profileManagingActions.stopManaging());
      setMeasurements([]);
      setIsMeasurementsWasIntended(false);
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
    } else {
      setIsMeasurementsWasIntended(false);
      setMeasurements([]);
    }

    return () => {
      setIsMeasurementsWasIntended(false);
      setMeasurements([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  return (
    <>
      {isMeasurementsWasIntended ? (
        <ProfileForm
          measurements={measurements}
          product={product}
          customer={customer}
        />
      ) : null}
    </>
  );
};

export default ProfileFormBootstrapper;
