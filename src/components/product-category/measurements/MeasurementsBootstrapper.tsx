import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers/index';
import { Measurement } from '../../../interfaces/measurements';
import { ProductCategory } from '../../../interfaces/products';
import { controlActions } from '../../../redux/slices/control.slice';
import MeasurementForm from './management/MeasurementForm';
import { assignPendingActions } from '../../../helpers/action.helper';
import { productActions } from '../../../redux/slices/product.slice';
import { measurementActions } from '../../../redux/slices/measurements/measurement.slice';
import Measurements from './Measurements';
import { List } from 'linq-typescript';

export const CREATE_YOUR_FIRST_MEASUREMENT: string =
  'Create your first measurement';
export const CREATE_MEASUREMENT: string = 'Create measurement';
export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

const MeasurementsBootstrapper: React.FC = () => {
  const dispatch = useDispatch();

  const [isWasIntended, setIsWasIntended] = useState<boolean>(false);

  const isEmpty: boolean = useSelector<IApplicationState, boolean>(
    (state) =>
      state.product.productMeasurementsState.measurementList.length === 0
  );

  const targetProduct = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  /// Dispose own state
  useEffect(() => {
    return () => {
      dispatch(productActions.updateProductMeasurementsList([]));
      dispatch(controlActions.closeDashboardHintStub());
      setIsWasIntended(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /// Get measurements (charts)
  useEffect(() => {
    if (targetProduct) {
      dispatch(
        assignPendingActions(
          productActions.apiGetAllProductMeasurementsByProductId(
            targetProduct.id
          ),
          [],
          [],
          (args: any) => {
            setIsWasIntended(true);
            dispatch(productActions.updateProductMeasurementsList(args));

            const measurementId = new List<Measurement>(args).firstOrDefault()
              ?.id;

            if (measurementId) {
              dispatch(
                assignPendingActions(
                  measurementActions.apiGetMeasurementById(measurementId),
                  [],
                  [],
                  (args: any) => {
                    dispatch(
                      productActions.changeSelectedProductMeasurement(args)
                    );
                  },
                  (args: any) => {}
                )
              );
            }
          },
          (args: any) => {
            setIsWasIntended(true);
          }
        )
      );
    } else {
      dispatch(productActions.updateProductMeasurementsList([]));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetProduct]);

  /// Resolve dashboard hint visibility
  useEffect(() => {
    if (isWasIntended) {
      if (isEmpty) {
        dispatch(
          controlActions.showDashboardHintStub({
            isVisible: true,
            title: CREATE_YOUR_FIRST_MEASUREMENT,
            buttonLabel: CREATE_MEASUREMENT,
            buttonAction: () => {
              dispatch(
                controlActions.openRightPanel({
                  title: 'New Measurement',
                  width: '400px',
                  closeFunctions: () => {
                    dispatch(controlActions.closeRightPanel());
                  },
                  component: MeasurementForm,
                })
              );
            },
          })
        );
      } else {
        dispatch(controlActions.closeDashboardHintStub());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWasIntended, isEmpty]);

  return <>{isWasIntended ? <Measurements /> : null}</>;
};

export default MeasurementsBootstrapper;
