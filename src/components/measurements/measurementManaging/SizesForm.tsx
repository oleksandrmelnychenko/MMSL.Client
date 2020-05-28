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

const buildMeasurement = (
  values: SizeInitValues,
  measurementDefinitions: MeasurementDefinition[],
  sourceEntity?: Measurement
) => {
  let newUnit: any = {
    productCategoryId: null,
    baseMeasurementId: null,
    name: '',
    measurementDefinitions: [],
  };

  //   newUnit.name = values.name;
  //   newUnit.description = values.description;
  //   newUnit.measurementDefinitions = measurementDefinitions;

  //   if (sourceEntity) {
  //     newUnit.id = sourceEntity.id;
  //   }

  return newUnit;
};

const initDefaultValues = (sourceEntity?: MeasurementSize | null) => {
  const initValues: SizeInitValues = new SizeInitValues();

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.description = sourceEntity.description
      ? sourceEntity.description
      : '';
  }

  return initValues;
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
  size?: MeasurementSize | null | undefined;

  submitAction: (args: any) => void;
}

export class DefinitionValueItem {
  private _initValue: string;

  constructor(
    mapDefinition: MeasurementMapDefinition,
    size?: MeasurementMapSize
  ) {
    this.sourceMapDefinition = mapDefinition;
    this.sizeMap = size;

    this.name =
      mapDefinition && mapDefinition.measurementDefinition
        ? mapDefinition.measurementDefinition.name
        : '';

    this._initValue = '';
    this.value = '';
    this.isDirty = false;

    if (size) {
      /// TODO: vadymk for edit
    }
  }

  name: string;
  value: string;

  isDirty: boolean;

  sourceMapDefinition: MeasurementMapDefinition;
  sizeMap: MeasurementMapSize | null | undefined;

  resolveIsDirty: () => boolean = () => {
    let isDirtyResult: boolean = false;

    // if (this.sizeMap) {
    //   /// TODO: vadymk for edit
    //   debugger;
    // } else {
    //   isDirtyResult = true;
    // }

    if (this._initValue !== this.value) {
      isDirtyResult = true;
    }

    this.isDirty = isDirtyResult;
    return isDirtyResult;
  };
}

export const SizesForm: React.FC<SizesFormProps> = (props: SizesFormProps) => {
  const initValues = initDefaultValues(props.size);

  const [targetMeasurement, setTargetMeasurement] = useState<
    Measurement | null | undefined
  >();
  const [valueItems, setValueItems] = useState<DefinitionValueItem[]>([]);

  useEffect(() => {
    return () => {
      setTargetMeasurement(null);
    };
  }, [setTargetMeasurement]);

  useEffect(() => {
    if (targetMeasurement) {
      const valueItems = new List(
        targetMeasurement.measurementMapDefinitions
          ? targetMeasurement.measurementMapDefinitions
          : []
      )
        .select<DefinitionValueItem>(
          (mapDefinition: MeasurementMapDefinition) => {
            let result = new DefinitionValueItem(mapDefinition);

            if (props.size) {
              /// TODO: vadymk resolve init value (for edit)
              debugger;
            }

            return result;
          }
        )
        .toArray();

      setValueItems(valueItems);
    }
  }, [targetMeasurement, props.size]);

  if (props.measurement !== targetMeasurement) {
    setTargetMeasurement(props.measurement);
  }

  return (
    <div className="sizeForm">
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string().required(() => 'Size name is required'),
          description: Yup.string(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          debugger;
          //   props.submitAction(
          // buildMeasurement(
          //   values,
          //   new List(addedRows)
          //     .where((item) => item.resolveIsDirty())
          //     .select((item) => item.buildUpdatedSource())
          //     .concat(
          //       new List(deletedRows)
          //         .select((item) => item.buildUpdatedSource())
          //         .toArray()
          //     )
          //     .toArray(),
          //   props.measurement as Measurement
          // )
          //   );
        }}
        onReset={(values: any, formikHelpers: any) => {
          debugger;
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
                            <Stack horizontal>
                              <Stack.Item>
                                <Text
                                  nowrap
                                  block
                                  styles={{ root: { maxWidth: '250px' } }}
                                >
                                  {valueItem.name}
                                </Text>
                              </Stack.Item>
                              <Stack.Item>
                                <div className="sizeForm__definitionItem__editNameInput">
                                  <TextField
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
