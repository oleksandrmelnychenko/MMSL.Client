import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { TextField, Text } from 'office-ui-fabric-react';
import { defaultCellStyle } from '../../../../../common/fabric-styles/styles';
import {
  Measurement,
  MeasurementMapDefinition,
  MeasurementMapValue,
} from '../../../../../interfaces/measurements';
import { ProductCategory } from '../../../../../interfaces/products';
import { List } from 'linq-typescript';
import '../baseMeasurement/chartGridCell.scss';
import { FittingType } from '../../../../../interfaces/fittingTypes';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { fittingTypesActions } from '../../../../../redux/slices/measurements/fittingTypes.slice';

export interface IBodySizeValueCellProps {
  fittingType: FittingType | null | undefined;
  chartColumn: MeasurementMapDefinition | null | undefined;
  measurementChart: Measurement | null | undefined;
  productCategory: ProductCategory | null | undefined;
}

const CELL_VALUE_STUB = '';

const _findColumnSizeValue = (
  fittingType: FittingType | null | undefined,
  chartColumn: MeasurementMapDefinition | null | undefined
) => {
  let truthValue: MeasurementMapValue | null | undefined;

  if (fittingType && fittingType.measurementMapValues && chartColumn) {
    truthValue = new List<any>(fittingType.measurementMapValues).firstOrDefault(
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

const BodySizeValueCell: React.FC<IBodySizeValueCellProps> = (
  props: IBodySizeValueCellProps
) => {
  const dispatch = useDispatch();

  const [inputEditRef] = useState<any>(React.createRef());
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [relativeMapValue, setRelativeMapValue] = useState<
    MeasurementMapValue | null | undefined
  >(null);
  const [outputValue, setOutputValue] = useState<string | undefined>();

  const possibleSizeValue = _findColumnSizeValue(
    props.fittingType,
    props.chartColumn
  );

  if (possibleSizeValue !== relativeMapValue) {
    setRelativeMapValue(
      _findColumnSizeValue(props.fittingType, props.chartColumn)
    );
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
      props.fittingType &&
      props.measurementChart &&
      props.chartColumn
    ) {
      const payload = {
        id: props.fittingType.id,
        type: props.fittingType.type,
        measurementUnitId: props.fittingType.measurementUnitId,
        measurementId: props.fittingType.measurementId,
        measurementMapValues: [
          {
            id: relativeMapValue ? relativeMapValue.id : 0,
            value: _normalizeInputValue(input),
            measurementDefinitionId: props.chartColumn.measurementDefinitionId,
          },
        ],
      };

      debugger;
      dispatch(
        assignPendingActions(
          fittingTypesActions.apiUpdateFittingType(payload),
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
                      styles={{ root: { position: 'absolute', top: '6px' } }}
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

export default BodySizeValueCell;
