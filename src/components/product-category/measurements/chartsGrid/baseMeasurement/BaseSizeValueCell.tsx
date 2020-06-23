import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { TextField, Text } from 'office-ui-fabric-react';
import { defaultCellStyle } from '../../../../../common/fabric-styles/styles';
import {
  Measurement,
  MeasurementMapDefinition,
  MeasurementMapSize,
  MeasurementMapValue,
} from '../../../../../interfaces/measurements';
import { ProductCategory } from '../../../../../interfaces/products';
import { List } from 'linq-typescript';
import { measurementActions } from '../../../../../redux/slices/measurements/measurement.slice';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import './chartGridCell.scss';

export interface IBaseSizeValueCellProps {
  mapSize: MeasurementMapSize | null | undefined;
  chartColumn: MeasurementMapDefinition | null | undefined;
  measurementChart: Measurement | null | undefined;
  productCategory: ProductCategory | null | undefined;
}

const CELL_VALUE_STUB = '';

const _findColumnSizeValue = (
  mapSize: MeasurementMapSize | null | undefined,
  chartColumn: MeasurementMapDefinition | null | undefined
) => {
  let truthValue: MeasurementMapValue | null | undefined;

  if (
    mapSize &&
    mapSize.measurementSize &&
    mapSize.measurementSize.measurementMapValues &&
    chartColumn
  ) {
    truthValue = new List<any>(
      mapSize.measurementSize.measurementMapValues
    ).firstOrDefault(
      (mapValueItem: any) =>
        mapValueItem.measurementDefinitionId ===
        chartColumn.measurementDefinitionId
    );
  }

  return truthValue;
};

const _normalizeInputValue = (rawInput: any) => {
  let normalizedValueResult: any = parseFloat(rawInput ? rawInput : '');

  if (isNaN(normalizedValueResult)) normalizedValueResult = null;

  return normalizedValueResult;
};

const BaseSizeValueCell: React.FC<IBaseSizeValueCellProps> = (
  props: IBaseSizeValueCellProps
) => {
  const dispatch = useDispatch();

  const [inputEditRef] = useState<any>(React.createRef());
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [relativeMapValue, setRelativeMapValue] = useState<
    MeasurementMapValue | null | undefined
  >(null);
  const [outputValue, setOutputValue] = useState<string | undefined>();

  const possibleSizeValue = _findColumnSizeValue(
    props.mapSize,
    props.chartColumn
  );

  if (possibleSizeValue !== relativeMapValue) {
    setRelativeMapValue(_findColumnSizeValue(props.mapSize, props.chartColumn));
  }

  useEffect(() => {
    if (relativeMapValue) {
      if (relativeMapValue.value) {
        setOutputValue(`${relativeMapValue.value}`);
      } else {
        setOutputValue(CELL_VALUE_STUB);
      }
    } else {
      setOutputValue(CELL_VALUE_STUB);
    }
  }, [relativeMapValue]);

  useEffect(() => {
    if (
      isInEditMode &&
      inputEditRef &&
      inputEditRef.current &&
      inputEditRef.focus
    ) {
      inputEditRef.current.focus();
    }
  }, [isInEditMode, inputEditRef, outputValue]);

  const onCompleteEditing = (input: string) => {
    if (
      input !== outputValue &&
      props.mapSize &&
      props.mapSize.measurementSize &&
      props.measurementChart &&
      props.chartColumn
    ) {
      const sizePayload: any = {
        id: props.mapSize.measurementSizeId,
        name: props.mapSize.measurementSize.name,
        description: props.mapSize.measurementSize.description,
        measurementId: props.measurementChart.id,
        valueDataContracts: [
          {
            id: relativeMapValue ? relativeMapValue.id : 0,
            value: _normalizeInputValue(input),
            measurementDefinitionId: props.chartColumn.measurementDefinitionId,
          },
        ],
      };

      dispatch(
        assignPendingActions(
          measurementActions.apiUpdateMeasurementSize(sizePayload),
          [],
          [],
          (args: any) => {
            setOutputValue(input);
            setIsInEditMode(false);
          },
          (args: any) => {}
        )
      );
    } else {
      setIsInEditMode(false);
    }
  };

  let init = {
    sizeValue: outputValue,
  };

  if (isNaN(parseFloat(init.sizeValue ? init.sizeValue : ''))) {
    (init as any).sizeValue = '';
  }

  return (
    <div className="chartGridCell">
      {isInEditMode ? (
        <Formik
          validationSchema={Yup.object().shape({
            sizeValue: Yup.string().nullable(),
          })}
          initialValues={init}
          onSubmit={(values: any) => {}}
        >
          {(formik) => {
            return (
              <Form>
                <Field name="sizeValue">
                  {() => (
                    <TextField
                      type="number"
                      styles={{
                        root: {
                          position: 'absolute',
                          top: '6px',
                          marginRight: '9px',
                        },
                      }}
                      autoFocus
                      componentRef={inputEditRef}
                      value={formik.values.sizeValue}
                      onKeyPress={(args: any) => {
                        if (args) {
                          if (args.charCode === 13) {
                            onCompleteEditing(
                              formik.values.sizeValue
                                ? formik.values.sizeValue
                                : ''
                            );
                          }
                        }
                      }}
                      onChange={(args: any) => {
                        let value = args.target.value;

                        formik.setFieldValue('sizeValue', value);
                        formik.setFieldTouched('sizeValue');
                      }}
                      onBlur={(args: any) =>
                        onCompleteEditing(
                          formik.values.sizeValue ? formik.values.sizeValue : ''
                        )
                      }
                    />
                  )}
                </Field>
              </Form>
            );
          }}
        </Formik>
      ) : (
        <div
          className="chartGridCell__readonlyContainer"
          onDoubleClick={() => setIsInEditMode(true)}
        >
          <Text block style={defaultCellStyle}>
            {outputValue}
          </Text>
        </div>
      )}
    </div>
  );
};

export default BaseSizeValueCell;
