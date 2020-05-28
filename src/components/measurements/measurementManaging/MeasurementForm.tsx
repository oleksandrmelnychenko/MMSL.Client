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
  measurementMapDefinitions,
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
  measurementDefinitions: MeasurementDefinition[],
  sourceEntity?: Measurement
) => {
  let newUnit: any = {
    productCategoryId: null,
    baseMeasurementId: null,
    name: '',
    measurementDefinitions: [],
  };

  newUnit.name = values.name;
  newUnit.description = values.description;
  newUnit.measurementDefinitions = measurementDefinitions;

  if (sourceEntity) {
    newUnit.id = sourceEntity.id;
  }

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

const initDefinitionItemsDefaults: (
  sourceEntity?: Measurement | null
) => DefinitionRowItem[] = (sourceEntity?: Measurement | null) => {
  let defaults: DefinitionRowItem[] = [];

  if (sourceEntity && sourceEntity.measurementMapDefinitions) {
    defaults = new List(sourceEntity.measurementMapDefinitions)
      .select<DefinitionRowItem>((itemMap: measurementMapDefinitions) => {
        const resultItem = new DefinitionRowItem(itemMap);

        return resultItem;
      })
      .toArray();
  }

  return defaults;
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
  constructor(source: measurementMapDefinitions) {
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

  source: measurementMapDefinitions;

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

export const MeasurementForm: React.FC<MeasurementFormProps> = (
  props: MeasurementFormProps
) => {
  const [isRowInputVisible, setIsRowInputVisible] = useState(false);
  const [addedRows, setAddedRows] = useState<DefinitionRowItem[]>([]);
  const [deletedRows, setDeletedRows] = useState<DefinitionRowItem[]>([]);
  const [newRowNameInput, setNewRowNameInput] = useState<string>('');
  const [inputRef] = useState<any>(React.createRef());
  const [inputEditRef] = useState<any>(React.createRef());
  const [editingMeasurement, setEditingMeasurement] = useState<
    Measurement | null | undefined
  >(null);

  /// TODO: extract existing rows (for Measurement edit)
  const initValues = initDefaultValues(props.measurement);
  /// TODO: extract existing rows (for Measurement edit)
  if (props.measurement && props.measurement !== editingMeasurement) {
    setEditingMeasurement(props.measurement);
  }

  /// Reset appropriate local state
  useEffect(() => {
    return () => {
      setEditingMeasurement(null);
    };
  }, [setEditingMeasurement]);

  useEffect(() => {
    if (editingMeasurement && editingMeasurement.measurementMapDefinitions) {
      setAddedRows(initDefinitionItemsDefaults(editingMeasurement));
    }
  }, [editingMeasurement]);

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
        new measurementMapDefinitions()
      );
      newRowDefinition.name = newRowNameInput;

      setAddedRows(new List(addedRows).concat([newRowDefinition]).toArray());
    }

    setNewRowNameInput('');
  };

  /// Deletes instance of Definition item
  const deleteRowItem: (itemToDelete: DefinitionRowItem) => void = (
    itemToDelete: DefinitionRowItem
  ) => {
    const rowList = new List(addedRows);
    rowList.remove(itemToDelete);

    if (itemToDelete.source && itemToDelete.source.id !== 0) {
      const deletedRowsList = new List(deletedRows);

      if (
        !deletedRowsList.any(
          (deletedRow) => deletedRow.source.id === itemToDelete.source.id
        )
      ) {
        itemToDelete.isDeleted = true;
        setDeletedRows(deletedRowsList.concat([itemToDelete]).toArray());
      }
    }

    setAddedRows(rowList.toArray());
  };

  /// Occurs when "inner" row item "name input" finish edit
  const onFinishRowItemNameEditFlow: (
    affectedItem: DefinitionRowItem
  ) => void = (affectedItem: DefinitionRowItem) => {
    const rowList = new List(addedRows);

    rowList.forEach((item) => (item.isEditingName = false));

    setAddedRows(rowList.toArray());

    if (affectedItem.name.length < 1) {
      deleteRowItem(affectedItem);
    }
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
          props.submitAction(
            buildMeasurement(
              values,
              new List(addedRows)
                .where((item) => item.resolveIsDirty())
                .select((item) => item.buildUpdatedSource())
                .concat(
                  new List(deletedRows)
                    .select((item) => item.buildUpdatedSource())
                    .toArray()
                )
                .toArray(),
              props.measurement as Measurement
            )
          );
        }}
        onReset={(values: any, formikHelpers: any) => {
          setAddedRows(initDefinitionItemsDefaults(editingMeasurement));
          setDeletedRows([]);
          setNewRowNameInput('');
          setIsRowInputVisible(false);
        }}
        innerRef={(formik: any) => {
          props.formikReference.formik = formik;

          if (formik) {
            if (props.formikReference.isDirtyFunc) {
              const isDirty =
                formik.dirty ||
                new List(addedRows).any((item) => item.resolveIsDirty()) ||
                deletedRows.length > 0;

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
                                    onClick={() => deleteRowItem(addedRowItem)}
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
                                          onFinishRowItemNameEditFlow(
                                            addedRowItem
                                          );
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
                                      onFinishRowItemNameEditFlow(addedRowItem);
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
