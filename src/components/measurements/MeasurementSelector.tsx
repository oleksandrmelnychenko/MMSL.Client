import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ComboBox, IComboBox, IComboBoxOption } from 'office-ui-fabric-react';
import { measurementActions } from '../../redux/slices/measurement.slice';
import { assignPendingActions } from '../../helpers/action.helper';
import { IApplicationState } from '../../redux/reducers';
import { Measurement } from '../../interfaces';
import { List } from 'linq-typescript';
import * as fabricStyles from '../../common/fabric-styles/styles';

const MeasurementSelector: React.FC = () => {
  const dispatch = useDispatch();

  const measurements = useSelector<IApplicationState, Measurement[]>(
    (state) => state.measurements.measurementList
  );

  const targetMeasurement = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.measurements.targetMeasurement);

  useEffect(() => {
    let action = assignPendingActions(
      measurementActions.apiGetAllMeasurements(),
      [],
      [],
      (args: any) => {
        dispatch(measurementActions.updateMeasurementsList(args));

        const measurementId = new List<Measurement>(args).firstOrDefault()?.id;

        if (measurementId) {
          let getChartAction = assignPendingActions(
            measurementActions.apiGetMeasurementById(measurementId),
            [],
            [],
            (args: any) => {
              dispatch(measurementActions.changeSelectedMeasurement(args));
            },
            (args: any) => {}
          );

          dispatch(getChartAction);
        }
      },
      (args: any) => {}
    );

    dispatch(action);

    return () => {};
  }, [dispatch]);

  const itemOptions = new List(measurements)
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
                dispatch(measurementActions.changeSelectedMeasurement(args));
              },
              (args: any) => {}
            );

            dispatch(action);
          } else {
            dispatch(measurementActions.changeSelectedMeasurement(null));
          }
        }}
      />
    </div>
  );
};

export default MeasurementSelector;
