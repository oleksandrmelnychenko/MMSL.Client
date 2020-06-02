import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { TextField, Text } from 'office-ui-fabric-react';
import { defaultCellStyle } from '../../../common/fabric-styles/styles';
import {
  Measurement,
  MeasurementMapDefinition,
  MeasurementMapSize,
  MeasurementMapValue,
  ProductCategory,
} from '../../../interfaces';
import { List } from 'linq-typescript';
import { measurementActions } from '../../../redux/slices/measurement.slice';
import { assignPendingActions } from '../../../helpers/action.helper';

export interface IProductChartGridCellProps {
  mapSize: MeasurementMapSize | null | undefined;
  chartColumn: MeasurementMapDefinition | null | undefined;
  measurementChart: Measurement | null | undefined;
  productCategory: ProductCategory | null | undefined;
}

const CELL_VALUE_STUB = '-';

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

/// TODO: vadymk this method is not used
const _normalizeInputValue = (rawInput: any) => {
  let normalizedValueResult: any = parseFloat(rawInput ? rawInput : '');

  if (isNaN(normalizedValueResult)) normalizedValueResult = null;

  return normalizedValueResult;
};

const ProductChartGridCell: React.FC<IProductChartGridCellProps> = (
  props: IProductChartGridCellProps
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
                      styles={{ root: { position: 'absolute', top: '6px' } }}
                      autoFocus
                      componentRef={inputEditRef}
                      value={formik.values.sizeValue}
                      onChange={(args: any) => {
                        let value = args.target.value;

                        formik.setFieldValue('sizeValue', value);
                        formik.setFieldTouched('sizeValue');
                      }}
                      onBlur={(args: any) => {
                        let normalizedOutputValue =
                          outputValue !== CELL_VALUE_STUB ? outputValue : '';
                        if (
                          normalizedOutputValue !== formik.values.sizeValue &&
                          props.mapSize &&
                          props.mapSize.measurementSize &&
                          props.measurementChart &&
                          props.chartColumn
                        ) {
                          const sizePayload: any = {
                            id: props.mapSize.measurementSizeId,
                            name: props.mapSize.measurementSize.name,
                            description:
                              props.mapSize.measurementSize.description,
                            measurementId: props.measurementChart.id,
                            valueDataContracts: [
                              {
                                id: relativeMapValue ? relativeMapValue.id : 0,
                                value: _normalizeInputValue(
                                  formik.values.sizeValue
                                ),
                                measurementDefinitionId:
                                  props.chartColumn.measurementDefinitionId,
                              },
                            ],
                          };

                          let action = assignPendingActions(
                            measurementActions.apiUpdateMeasurementSize(
                              sizePayload
                            ),
                            [],
                            [],
                            (args: any) => {
                              setOutputValue(formik.values.sizeValue);
                              setIsInEditMode(false);
                              formik.resetForm();
                            },
                            (args: any) => {}
                          );

                          dispatch(action);
                        } else {
                          setIsInEditMode(false);
                          formik.resetForm();
                        }
                      }}
                    />
                  )}
                </Field>
              </Form>
            );
          }}
        </Formik>
      ) : (
        <Text
          block
          onDoubleClick={() => setIsInEditMode(true)}
          style={defaultCellStyle}
        >
          {outputValue}
        </Text>
      )}
    </div>
  );
};

export default ProductChartGridCell;
