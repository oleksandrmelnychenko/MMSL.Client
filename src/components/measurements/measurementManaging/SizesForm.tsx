import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import {
  FormicReference,
  Measurement,
  MeasurementDefinition,
  MeasurementMapDefinition,
  MeasurementSize,
} from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import './measurementForm.scss';

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
    this.submitAction = (args: any) => {};
    this.size = null;
  }

  formikReference: FormicReference;
  submitAction: (args: any) => void;
  size?: MeasurementSize | null;
}

export class DefinitionRowItem {
  constructor(source: MeasurementMapDefinition) {
    this.isEditingName = false;
    this.source = source;

    this.name =
      source && source.measurementDefinition
        ? source.measurementDefinition.name
        : '';
    this.isDeleted = false;
  }

  isEditingName: boolean;
  name: string;
  isDeleted: boolean;

  source: MeasurementMapDefinition;

  resolveIsDirty: () => boolean = () => {
    let isDirty = false;

    if (
      this.name !== this.source?.measurementDefinition?.name ||
      this.isDeleted !== this.source?.measurementDefinition?.isDeleted
    ) {
      isDirty = true;
    }

    return isDirty;
  };

  buildUpdatedSource: () => MeasurementDefinition = () => {
    let builtMeasurementDefinition: any = {
      ...this.source.measurementDefinition,
    };

    builtMeasurementDefinition.name = this.name;
    builtMeasurementDefinition.isDeleted = this.isDeleted;
    builtMeasurementDefinition.mapId = this.source.id;

    return builtMeasurementDefinition;
  };
}

export const SizesForm: React.FC<SizesFormProps> = (props: SizesFormProps) => {
  const initValues = initDefaultValues(props.size);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="measurementsForm">
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string().required(() => 'Name is required'),
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
              const isDirty = formik.dirty;

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
