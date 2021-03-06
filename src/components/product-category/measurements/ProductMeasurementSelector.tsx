import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ComboBox, IComboBox, IComboBoxOption } from 'office-ui-fabric-react';
import { productActions } from '../../../redux/slices/product.slice';
import { measurementActions } from '../../../redux/slices/measurements/measurement.slice';
import { assignPendingActions } from '../../../helpers/action.helper';
import { IApplicationState } from '../../../redux/reducers';
import { Measurement } from '../../../interfaces/measurements';
import { List } from 'linq-typescript';
import * as fabricStyles from '../../../common/fabric-styles/styles';

const ProductMeasurementSelector: React.FC = () => {
  const dispatch = useDispatch();

  const productMeasurements = useSelector<IApplicationState, Measurement[]>(
    (state) => state.product.productMeasurementsState.measurementList
  );

  const targetMeasurement = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.product.productMeasurementsState.targetMeasurement);

  const itemOptions = new List(productMeasurements)
    .select((measurementItem) => {
      let text = measurementItem.name;

      if (measurementItem.measurementUnit) {
        text = `${text} (${measurementItem.measurementUnit.name})`;
      }

      return {
        key: `${measurementItem.id}`,
        text: text,
        measurement: measurementItem,
      };
    })
    .toArray();

  return (
    <>
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
          } else {
            dispatch(productActions.changeSelectedProductMeasurement(null));
          }
        }}
      />
    </>
  );
};

export default ProductMeasurementSelector;
