import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Text,
  Stack,
  TextField,
  ActionButton,
  IconButton,
} from 'office-ui-fabric-react';
import * as Yup from 'yup';
import {
  FormicReference,
  Measurement,
  MeasurementDefinition,
} from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import './measurementForm.scss';
import { List } from 'linq-typescript';

export class MeasurementFormInitValues {
  constructor() {
    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}

const buildMeasurement = (
  values: MeasurementFormInitValues,
  sourceEntity?: Measurement
) => {
  let newUnit: Measurement;

  if (sourceEntity) {
    newUnit = { ...sourceEntity };
  } else {
    newUnit = new Measurement();
  }

  newUnit.name = values.name;
  newUnit.description = values.description;

  return newUnit;
};

const initDefaultValues = (sourceEntity?: Measurement | null) => {
  const initValues: MeasurementFormInitValues = new MeasurementFormInitValues();

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.description = sourceEntity.description
      ? sourceEntity.description
      : '';
  }

  return initValues;
};

export class MeasurementFormProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.submitAction = (args: any) => {};
    this.measurement = null;
  }

  formikReference: FormicReference;
  submitAction: (args: any) => void;
  measurement?: Measurement | null;
}

export class DefinitionRowItem {
  constructor(source: MeasurementDefinition) {
    this.name = '';
    this.isEditingName = false;

    this.source = source;
  }

  name: string;
  isEditingName: boolean;

  source: MeasurementDefinition;

  resolveIsDirty: () => boolean = () => {
    let isDirty = false;

    if (this.name !== this.source?.name) {
      isDirty = true;
    }

    return isDirty;
  };
}

export const MeasurementForm: React.FC<MeasurementFormProps> = (
  props: MeasurementFormProps
) => {
  const [isRowInputVisible, setIsRowInputVisible] = useState(false);
  const [addedRows, setAddedRows] = useState<DefinitionRowItem[]>([]);
  const [newRowNameInput, setNewRowNameInput] = useState<string>('');
  const [inputRef] = useState<any>(React.createRef());
  const [inputEditRef] = useState<any>(React.createRef());

  /// TODO: extract existing rows (for Measurement edit)
  const initValues = initDefaultValues(props.measurement);
  /// TODO: extract existing rows (for Measurement edit)

  /// Efect to focus on new "main" row item input
  useEffect(() => {
    if (isRowInputVisible && inputRef && inputRef.current && inputRef.focus) {
      inputRef.focus();
    }
  }, [isRowInputVisible, inputRef]);

  /// Efect to focus on concrete row item input (when editing
  /// concrete item name)
  useEffect(() => {
    if (
      addedRows &&
      new List(addedRows).any((item) => item.isEditingName) &&
      inputEditRef &&
      inputEditRef.current &&
      inputEditRef.focus
    ) {
      inputEditRef.focus();
    }
  }, [addedRows, inputEditRef]);

  /// Creates new instance of Definition item and clear input
  const createNewRowItem = () => {
    if (newRowNameInput) {
      const newRowDefinition = new DefinitionRowItem(
        new MeasurementDefinition()
      );
      newRowDefinition.name = newRowNameInput;

      setAddedRows(new List(addedRows).concat([newRowDefinition]).toArray());
    }

    setNewRowNameInput('');
  };

  return (
    <div className="measurementsForm">
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(3)
            .required(() => 'Name is required'),
          description: Yup.string(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          debugger;
          props.submitAction(
            buildMeasurement(values, props.measurement as Measurement)
          );
        }}
        onReset={(values: any, formikHelpers: any) => {
          /// TODO: extract existing rows (for Measurement edit)
          setAddedRows([]);
          setNewRowNameInput('');
          setIsRowInputVisible(false);
          /// TODO: extract existing rows (for Measurement edit)
        }}
        innerRef={(formik: any) => {
          props.formikReference.formik = formik;

          if (formik) {
            if (props.formikReference.isDirtyFunc) {
              const isDirty =
                formik.dirty ||
                new List(addedRows).any((item) => item.resolveIsDirty());

              console.log(`F ${isDirty}`);

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
                  <Stack>
                    <ActionButton
                      onClick={() => {
                        setIsRowInputVisible(!isRowInputVisible);
                        createNewRowItem();
                      }}
                      iconProps={{
                        iconName: 'BoxAdditionSolid',
                        styles: {
                          root: {
                            fontSize: '20px',
                          },
                        },
                      }}
                      styles={{
                        root: {
                          position: 'relative',
                          left: '-9px',
                        },
                      }}
                      allowDisabledFocus
                    >
                      New column
                    </ActionButton>

                    <Stack tokens={{ childrenGap: '12px' }}>
                      {isRowInputVisible ? (
                        <Stack.Item>
                          <div className="measurementsForm__rowInput">
                            <div className="measurementsForm__rowInput__innerBorder">
                              <TextField
                                autoFocus
                                componentRef={inputRef}
                                value={newRowNameInput}
                                onKeyPress={(args: any) => {
                                  if (args) {
                                    if (args.charCode === 13) {
                                      createNewRowItem();
                                      setIsRowInputVisible(false);
                                    }
                                  }
                                }}
                                onChange={(args: any) => {
                                  setNewRowNameInput(args.target.value);
                                }}
                                onFocus={(args: any) => {}}
                                onBlur={(args: any) => {
                                  createNewRowItem();
                                  setIsRowInputVisible(false);
                                }}
                                borderless={true}
                                resizable={false}
                              />
                            </div>
                          </div>
                        </Stack.Item>
                      ) : null}

                      <Stack tokens={{ childrenGap: '6px' }}>
                        {addedRows.map((addedRowItem, index) => {
                          return (
                            <div
                              className="measurementsForm__definitionItem"
                              key={index}
                            >
                              <div className="measurementsForm__definitionItem__options">
                                <Stack
                                  tokens={{ childrenGap: '5px' }}
                                  styles={{ root: { margin: '6px' } }}
                                  horizontal
                                  horizontalAlign="end"
                                >
                                  <IconButton
                                    onClick={() => {
                                      const rowList = new List(addedRows);

                                      rowList.forEach(
                                        (item) => (item.isEditingName = false)
                                      );

                                      if (addedRowItem) {
                                        addedRowItem.isEditingName = true;
                                      }

                                      setAddedRows(rowList.toArray());
                                    }}
                                    styles={{
                                      root: {
                                        height: '27px',
                                        width: '27px',
                                        border: '1px solid rgba(199,224,244,1)',
                                      },
                                    }}
                                    iconProps={{
                                      iconName: 'EditSolid12',
                                      styles: {
                                        root: {
                                          fontSize: '14px',
                                        },
                                      },
                                    }}
                                    title="Edit name"
                                  />
                                  <IconButton
                                    onClick={() => {
                                      const rowList = new List(addedRows);
                                      rowList.remove(addedRowItem);

                                      setAddedRows(rowList.toArray());
                                    }}
                                    styles={{
                                      root: {
                                        height: '27px',
                                        width: '27px',
                                        border: '1px solid rgba(199,224,244,1)',
                                      },
                                    }}
                                    iconProps={{
                                      iconName: 'Cancel',
                                      styles: {
                                        root: {
                                          fontSize: '14px',
                                          fontWeight: 600,
                                          color: '#a4373a',
                                        },
                                      },
                                    }}
                                    title="Delete"
                                  />
                                </Stack>
                              </div>

                              {addedRowItem.isEditingName ? (
                                <div className="measurementsForm__definitionItem__editNameInput">
                                  <TextField
                                    autoFocus
                                    componentRef={inputEditRef}
                                    borderless
                                    value={addedRowItem.name}
                                    onKeyPress={(args: any) => {
                                      if (args) {
                                        if (args.charCode === 13) {
                                          const rowList = new List(addedRows);

                                          rowList.forEach(
                                            (item) =>
                                              (item.isEditingName = false)
                                          );

                                          setAddedRows(rowList.toArray());
                                        }
                                      }
                                    }}
                                    onChange={(args: any) => {
                                      addedRowItem.name = args.target.value;

                                      setAddedRows(
                                        new List(addedRows).toArray()
                                      );
                                    }}
                                    onBlur={(args: any) => {
                                      const rowList = new List(addedRows);

                                      rowList.forEach(
                                        (item) => (item.isEditingName = false)
                                      );

                                      setAddedRows(rowList.toArray());
                                    }}
                                  />
                                </div>
                              ) : (
                                <Text
                                  nowrap
                                  block
                                  styles={{ root: { maxWidth: '250px' } }}
                                >
                                  {addedRowItem.name}
                                </Text>
                              )}
                            </div>
                          );
                        })}
                      </Stack>
                    </Stack>
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

export default MeasurementForm;
