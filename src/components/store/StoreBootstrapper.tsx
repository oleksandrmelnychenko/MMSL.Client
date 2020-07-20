import React, { useState, useEffect } from 'react';
import Stores from './Stores';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { assignPendingActions } from '../../helpers/action.helper';
import { storeActions } from '../../redux/slices/store/store.slice';

const StoreViewBootstrapper: React.FC = () => {
  const dispatch = useDispatch();

  const [isWasIntended, setIsWasIntended] = useState<boolean>(false);

  const isEmpty: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.store.fabrics.length === 0
  );

  useEffect(() => {
    dispatch(
      assignPendingActions(
        storeActions.apiGetAllStores(),
        [],
        [],
        (args: any) => {
          //   setIsWasIntended(true);
          //   dispatch(productActions.updateProductMeasurementsList(args));
          //   const measurementId = new List<Measurement>(args).firstOrDefault()
          //     ?.id;
          //   if (measurementId) {
          //     dispatch(
          //       assignPendingActions(
          //         measurementActions.apiGetMeasurementById(measurementId),
          //         [],
          //         [],
          //         (args: any) => {
          //           dispatch(
          //             productActions.changeSelectedProductMeasurement(args)
          //           );
          //         },
          //         (args: any) => {}
          //       )
          //     );
          //   }
        },
        (args: any) => {
          //   setIsWasIntended(true);
        }
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Stores />
    </div>
  );
};

export default StoreViewBootstrapper;
