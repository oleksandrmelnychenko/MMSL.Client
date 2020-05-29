import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, Separator, Text } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import {
  FormicReference,
  Measurement,
  MeasurementDefinition,
  MeasurementMapDefinition,
  MeasurementSize,
  MeasurementMapSize,
  MeasurementMapValue,
} from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import './sizeForm.scss';
import { List } from 'linq-typescript';

export class SizeInitValues {
  constructor() {
    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}

const buildSize = (
  values: SizeInitValues,
  measurement: Measurement | null | undefined,
  valueItems: DefinitionValueItem[],
  sourceEntity?: MeasurementMapSize | null | undefined
) => {
  const sizePayload: any = {};

  const dirtyValueItemsList = new List<DefinitionValueItem>(
    valueItems
  ).where((item) => item.resolveIsDirty());

  if (sourceEntity) {
    /// Editing size flow
    sizePayload.id = sourceEntity.measurementSizeId;
    sizePayload.name = values.name;
    sizePayload.description = values.description;

    sizePayload.valueDataContracts = dirtyValueItemsList
      .select((valueItem) => {
        const valueDataContract: any = {};
        valueDataContract.id = valueItem.getMapValueId();
        valueDataContract.value = parseFloat(valueItem.value);

        if (isNaN(valueDataContract.value)) valueDataContract.value = null;

        return valueDataContract;
      })
      .toArray();
  } else {
    /// Creating new size flow
    sizePayload.name = values.name;
    sizePayload.description = values.description;
    sizePayload.measurementId = measurement ? measurement.id : 0;

    sizePayload.valueDataContracts = dirtyValueItemsList
      .select((valueItem) => {
        return {
          measurementDefinitionId:
            valueItem.sourceMapDefinition.measurementDefinitionId,
          value: parseFloat(valueItem.value),
        };
      })
      .where((itemContract) => !isNaN(itemContract.value))
      .toArray();
  }

  debugger;

  return sizePayload;
};

const initDefaultValues = (
  sourceEntity?: MeasurementMapSize | null | undefined
) => {
  const initValues: SizeInitValues = new SizeInitValues();

  if (sourceEntity?.measurementSize) {
    initValues.name = sourceEntity.measurementSize.name;
    initValues.description = sourceEntity.measurementSize.description;
  }

  return initValues;
};

const initValueItemsDefaults = (
  measurement: Measurement | null | undefined,
  sourceEntity?: MeasurementMapSize | null | undefined
) => {
  let result: DefinitionValueItem[] = [];

  if (measurement?.measurementMapDefinitions) {
    result = new List(
      measurement.measurementMapDefinitions
        ? measurement.measurementMapDefinitions
        : []
    )
      .select<DefinitionValueItem>(
        (mapDefinition: MeasurementMapDefinition) => {
          const resultItem = new DefinitionValueItem(mapDefinition);

          const targetDefinitionId = mapDefinition.measurementDefinitionId;

          if (sourceEntity?.measurementSize?.measurementMapValues) {
            const targetMapValue:
              | MeasurementMapValue
              | null
              | undefined = new List<MeasurementMapValue>(
              sourceEntity.measurementSize.measurementMapValues
            ).firstOrDefault(
              (mapValueItem) =>
                mapValueItem.measurementDefinitionId === targetDefinitionId
            );

            if (targetMapValue) {
              resultItem.setMapValue(targetMapValue);
            }
          }

          return resultItem;
        }
      )
      .toArray();
  }

  return result;
};

export class SizesFormProps {
  constructor() {
    this.formikReference = new FormicReference();

    this.measurement = null;
    this.size = null;

    this.submitAction = (args: any) => {};
  }

  formikReference: FormicReference;
  measurement: Measurement | null | undefined;
  size?: MeasurementMapSize | null | undefined;

  submitAction: (args: any) => void;
}

export class DefinitionValueItem {
  private _mapValue: MeasurementMapValue | null | undefined;

  constructor(mapDefinition: MeasurementMapDefinition) {
    this.sourceMapDefinition = mapDefinition;

    this.name =
      mapDefinition && mapDefinition.measurementDefinition
        ? mapDefinition.measurementDefinition.name
        : '';

    this.value = '';
    this.isDirty = false;
  }

  name: string;
  value: string;

  isDirty: boolean;

  sourceMapDefinition: MeasurementMapDefinition;

  resolveIsDirty: () => boolean = () => {
    let isDirtyResult: boolean = false;

    if (this._mapValue) {
      /// If `init map value` is not null and is different
      /// to `item input value` - state becomes `dirty`
      if (this.value !== `${this._mapValue.value}`) isDirtyResult = true;
    } else {
      /// If `init mapValue` is NULL item is handled as
      /// new value, so it's becomes dirty.
      isDirtyResult = true;
    }

    this.isDirty = isDirtyResult;
    return isDirtyResult;
  };

  setMapValue: (mapValue: MeasurementMapValue | null | undefined) => void = (
    mapValue: MeasurementMapValue | null | undefined
  ) => {
    this._mapValue = mapValue;

    if (this._mapValue) {
      this.value = `${this._mapValue.value}`;
    } else {
      this.value = '';
    }
  };

  /// Returns "relative map value" id, if "relative value"
  /// is not exist - id will be 0
  getMapValueId: () => number = () => {
    let idResult = 0;

    if (this._mapValue) {
      idResult = this._mapValue.id;
    }

    return idResult;
  };
}

export const SizesForm: React.FC<SizesFormProps> = (props: SizesFormProps) => {
  const initValues = initDefaultValues(props.size);

  const [targetMeasurement, setTargetMeasurement] = useState<
    Measurement | null | undefined
  >();
  const [sizeChartForEdit, setSizeChartForEdit] = useState<
    MeasurementMapSize | null | undefined
  >();
  const [valueItems, setValueItems] = useState<DefinitionValueItem[]>([]);

  useEffect(() => {
    return () => {
      setTargetMeasurement(null);
      setSizeChartForEdit(null);
    };
  }, [setTargetMeasurement, setSizeChartForEdit]);

  useEffect(() => {
    if (targetMeasurement) {
      setValueItems(
        initValueItemsDefaults(targetMeasurement, sizeChartForEdit)
      );
    }
  }, [targetMeasurement, sizeChartForEdit]);

  if (props.measurement !== targetMeasurement)
    setTargetMeasurement(props.measurement);

  if (props.size !== sizeChartForEdit) setSizeChartForEdit(props.size);

  return (
    <div className="sizeForm">
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string().required(() => 'Size name is required'),
          description: Yup.string(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          props.submitAction(
            buildSize(values, targetMeasurement, valueItems, sizeChartForEdit)
          );
        }}
        onReset={(values: any, formikHelpers: any) => {
          setValueItems(initValueItemsDefaults(targetMeasurement));
        }}
        innerRef={(formik: any) => {
          props.formikReference.formik = formik;

          if (formik) {
            if (props.formikReference.isDirtyFunc) {
              const isDirty =
                formik.dirty ||
                new List(valueItems).any((valueItem) =>
                  valueItem.resolveIsDirty()
                );

              props.formikReference.isDirtyFunc(isDirty);
            }
          }
        }}
        validateOnBlur={false}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack tokens={{ childrenGap: '20px' }}>
                  <Stack>
                    <Field name="name">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.name}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Name"
                            required
                            onChange={(args: any) => {
                              let value = args.target.value;

                              formik.setFieldValue('name', value);
                              formik.setFieldTouched('name');
                            }}
                            errorMessage={
                              formik.errors.name && formik.touched.name ? (
                                <span className="form__group__error">
                                  {formik.errors.name}
                                </span>
                              ) : (
                                ''
                              )
                            }
                          />
                        </div>
                      )}
                    </Field>
                  </Stack>

                  <Stack tokens={{ childrenGap: '6px' }}>
                    <Separator alignContent="start">Columns (charts)</Separator>
                    {valueItems.map(
                      (valueItem: DefinitionValueItem, index: number) => {
                        return (
                          <div className="sizeForm__definitionItem" key={index}>
                            <Stack horizontal horizontalAlign="space-between">
                              <Stack.Item
                                styles={{
                                  root: {
                                    display: 'flex',
                                    alignItems: 'center',
                                  },
                                }}
                              >
                                <Text>{valueItem.name}</Text>
                              </Stack.Item>
                              <Stack.Item>
                                <div className="sizeForm__definitionItem__editNameInput">
                                  <TextField
                                    type="number"
                                    borderless
                                    value={valueItem.value}
                                    onChange={(args: any) => {
                                      valueItem.value = args.target.value;
                                      valueItem.resolveIsDirty();
                                      setValueItems(
                                        new List(valueItems).toArray()
                                      );
                                    }}
                                  />
                                </div>
                              </Stack.Item>
                            </Stack>
                          </div>
                        );
                      }
                    )}
                  </Stack>
                </Stack>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SizesForm;
