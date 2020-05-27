import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ComboBox, IComboBox, IComboBoxOption } from 'office-ui-fabric-react';
import { measurementActions } from '../../redux/slices/measurement.slice';
import { assignPendingActions } from '../../helpers/action.helper';
import { IApplicationState } from '../../redux/reducers';
import { Measurement } from '../../interfaces';
import { List } from 'linq-typescript';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

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
        // dispatch(measurementActions.updateMeasurementsList([]));
        dispatch(
          measurementActions.changeSelectedMeasurement(
            new List<Measurement>(args).firstOrDefault()
          )
        );
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
        autoComplete={true ? 'on' : 'off'}
        options={itemOptions}
        onChange={(
          event: React.FormEvent<IComboBox>,
          option?: IComboBoxOption,
          index?: number,
          value?: string
        ) => {
          if (option) {
            /// TODO: probably use `get measurement by id` (when api will be prepared)
            dispatch(
              measurementActions.changeSelectedMeasurement(
                (option as any).measurement
              )
            );
          } else {
            dispatch(
              measurementActions.changeSelectedMeasurement(
                new List<Measurement>(
                  measurements ? measurements : []
                ).firstOrDefault()
              )
            );
          }
        }}
      />
    </div>
  );
};

export default MeasurementSelector;
