import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ComboBox, IComboBox, IComboBoxOption } from 'office-ui-fabric-react';
import { productActions } from '../../../redux/slices/product.slice';
import { controlActions } from '../../../redux/slices/control.slice';
import { measurementActions } from '../../../redux/slices/measurement.slice';
import { assignPendingActions } from '../../../helpers/action.helper';
import { IApplicationState } from '../../../redux/reducers';
import { Measurement, ProductCategory } from '../../../interfaces';
import { List } from 'linq-typescript';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import {
  CREATE_YOUR_FIRST_MEASUREMENT,
  CREATE_MEASUREMENT,
} from './Measurements';
import MeasurementForm from './management/MeasurementForm';

// if (args.length === 0) {
//   dispatch(
//     controlActions.showDashboardHintStub({
//       isVisible: true,
//       title: CREATE_YOUR_FIRST_MEASUREMENT,
//       buttonLabel: CREATE_MEASUREMENT,
//       buttonAction: () => {
//         dispatch(
//           controlActions.openRightPanel({
//             title: 'New Measurement',
//             width: '400px',
//             closeFunctions: () => {
//               dispatch(controlActions.closeRightPanel());
//             },
//             component: MeasurementForm,
//           })
//         );
//       },
//     })
//   );
// }

const ProductMeasurementSelector: React.FC = () => {
  const dispatch = useDispatch();

  const productMeasurements = useSelector<IApplicationState, Measurement[]>(
    (state) => state.product.productMeasurementsState.measurementList
  );

  const targetMeasurement = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.product.productMeasurementsState.targetMeasurement);

  // const targetProductCategory = useSelector<
  //   IApplicationState,
  //   ProductCategory | null | undefined
  // >((state) => state.product.choose.category);

  // useEffect(() => {
  //   if (targetProductCategory) {
  //     dispatch(
  //       assignPendingActions(
  //         productActions.apiGetAllProductMeasurementsByProductId(
  //           targetProductCategory.id
  //         ),
  //         [],
  //         [],
  //         (args: any) => {
  //           dispatch(productActions.updateProductMeasurementsList(args));

  //           const measurementId = new List<Measurement>(args).firstOrDefault()
  //             ?.id;

  //           if (measurementId) {
  //             dispatch(
  //               assignPendingActions(
  //                 measurementActions.apiGetMeasurementById(measurementId),
  //                 [],
  //                 [],
  //                 (args: any) => {
  //                   dispatch(
  //                     productActions.changeSelectedProductMeasurement(args)
  //                   );
  //                 },
  //                 (args: any) => {}
  //               )
  //             );
  //           }
  //         },
  //         (args: any) => {}
  //       )
  //     );
  //   } else {
  //     dispatch(productActions.updateProductMeasurementsList([]));
  //   }

  //   return () => {};
  // }, [dispatch, targetProductCategory]);

  const itemOptions = new List(productMeasurements)
    .select((measurementItem) => {
      return {
        key: `${measurementItem.id}`,
        text: measurementItem.name,
        measurement: measurementItem,
      };
    })
    .toArray();

  return (
    <div>
      <ComboBox
        selectedKey={targetMeasurement ? `${targetMeasurement.id}` : null}
        allowFreeform={true}
        label="Size charts"
        autoComplete={true ? 'on' : 'off'}
        options={itemOptions}
        useComboBoxAsMenuWidth={true}
        styles={{
          ...fabricStyles.comboBoxStyles,
          container: { marginTop: '-41px' },
        }}
        onChange={(
          event: React.FormEvent<IComboBox>,
          option?: IComboBoxOption,
          index?: number,
          value?: string
        ) => {
          let measurementId = (option as any)?.measurement?.id;

          if (measurementId) {
            let action = assignPendingActions(
              measurementActions.apiGetMeasurementById(measurementId),
              [],
              [],
              (args: any) => {
                dispatch(productActions.changeSelectedProductMeasurement(args));
              },
              (args: any) => {}
            );

            dispatch(action);
          } else {
            dispatch(productActions.changeSelectedProductMeasurement(null));
          }
        }}
      />
    </div>
  );
};

export default ProductMeasurementSelector;
