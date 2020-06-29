import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignPendingActions } from '../../../../helpers/action.helper';
import OrderMeasurementsForm from './OrderMeasurementsForm';
import { productActions } from '../../../../redux/slices/product.slice';
import { Measurement, FittingType } from '../../../../interfaces/measurements';
import { CustomerProductProfile } from '../../../../interfaces/orderProfile';
import { IApplicationState } from '../../../../redux/reducers';
import { fittingTypesActions } from '../../../../redux/slices/measurements/fittingTypes.slice';

export const OrderMeasurementsFormBootstrapper: React.FC = () => {
  const dispatch = useDispatch();

  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isMeasurementsWasIntended, setIsMeasurementsWasIntended] = useState<
    boolean
  >(false);

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
          productActions.apiGetAllProductMeasurementsByProductId(
            targetOrderProfile.productCategoryId
          ),
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
  }, [targetOrderProfile]);

  return (
    <>
      {isMeasurementsWasIntended ? (
        <OrderMeasurementsForm measurements={measurements} />
      ) : null}
    </>
  );
};

export default OrderMeasurementsFormBootstrapper;
