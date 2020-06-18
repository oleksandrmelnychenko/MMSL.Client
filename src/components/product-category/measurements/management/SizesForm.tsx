import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, Separator, Text } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference } from '../../../../interfaces';
import {
  Measurement,
  MeasurementMapDefinition,
  MeasurementMapSize,
  MeasurementMapValue,
} from '../../../../interfaces/measurements';
import * as fabricStyles from '../../../../common/fabric-styles/styles';
import './sizeForm.scss';
import { List } from 'linq-typescript';
import { controlActions } from '../../../../redux/slices/control.slice';
import { measurementActions } from '../../../../redux/slices/measurements/measurement.slice';
import { productActions } from '../../../../redux/slices/product.slice';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetCommandBarItemProps,
  CommandBarItem,
  ChangeItemsDisabledState,
} from '../../../../helpers/commandBar.helper';
import { IApplicationState } from '../../../../redux/reducers';
import { assignPendingActions } from '../../../../helpers/action.helper';

export class SizeInitValues {
  constructor() {
    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}

const _buildNewSizePayload = (
  values: SizeInitValues,
  measurement: Measurement,
  valueItems: DefinitionValueItem[]
) => {
  const sizePayload: any = {
    name: values.name,
    description: values.description,
    measurementId: measurement.id,
    valueDataContracts: [],
  };

  const dirtyValueItemsList = new List<DefinitionValueItem>(
    valueItems
  ).where((item) => item.resolveIsDirty());

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

  return sizePayload;
};

const _buildEditedSizePayload = (
  values: SizeInitValues,
  measurement: Measurement,
  valueItems: DefinitionValueItem[],
  sourceEntity: MeasurementMapSize
) => {
  const sizePayload: any = {
    id: sourceEntity.measurementSizeId,
    name: values.name,
    description: values.description,
    measurementId: measurement.id,
    valueDataContracts: [],
  };

  const dirtyValueItemsList = new List<DefinitionValueItem>(
    valueItems
  ).where((item) => item.resolveIsDirty());

  sizePayload.valueDataContracts = dirtyValueItemsList
    .select((valueItem) => {
      const valueDataContract: any = {};
      valueDataContract.id = valueItem.getMapValueId();
      valueDataContract.value = parseFloat(valueItem.value);
      valueDataContract.measurementDefinitionId =
        valueItem.sourceMapDefinition.measurementDefinitionId;

      if (isNaN(valueDataContract.value)) valueDataContract.value = null;

      return valueDataContract;
    })
    // .where(
    //   (itemContract) => itemContract.value !== null && itemContract.id !== 0
    // )
    .toArray();

  return sizePayload;
};

const _initDefaultValues = (
  sourceEntity?: MeasurementMapSize | null | undefined
) => {
  const initValues: SizeInitValues = new SizeInitValues();

  if (sourceEntity?.measurementSize) {
    initValues.name = sourceEntity.measurementSize.name;
    initValues.description = sourceEntity.measurementSize.description;
  }

  return initValues;
};

const _initValueItemsDefaults = (
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
      if (this.value !== '') {
        isDirtyResult = true;
      }
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

  updateInitMapValue = () => {
    if (this._mapValue) {
      let value: any = parseFloat(this.value);

      if (isNaN(value)) {
        value = null;
      }
      this._mapValue.value = value;
    }
  };
}

export const SizesForm: React.FC = () => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);
  const [valueItems, setValueItems] = useState<DefinitionValueItem[]>([]);

  const measurement = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.product.productMeasurementsState.targetMeasurement);

  const sizeForEdit = useSelector<
    IApplicationState,
    MeasurementMapSize | null | undefined
  >((state) => state.product.productMeasurementsState.sizeForEdit);

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  useEffect(() => {
    if (formikReference.formik) {
      dispatch(
        controlActions.setPanelButtons([
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            formikReference.formik.submitForm();
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            formikReference.formik.resetForm();
          }),
        ])
      );
    }
  }, [formikReference, dispatch]);

  useEffect(() => {
    if (new List(commandBarItems).any()) {
      dispatch(
        controlActions.setPanelButtons(
          ChangeItemsDisabledState(
            commandBarItems,
            [CommandBarItem.Reset, CommandBarItem.Save],
            !isFormikDirty
          )
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormikDirty, dispatch]);

  useEffect(() => {
    setValueItems(_initValueItemsDefaults(measurement, sizeForEdit));

    return () => {
      dispatch(productActions.changeProductMeasurementSizeForEdit(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createNewSize = (values: SizeInitValues) => {
    if (measurement) {
      const payload = _buildNewSizePayload(values, measurement, valueItems);

      dispatch(
        assignPendingActions(
          measurementActions.apiCreateNewMeasurementSize(payload),
          [],
          [],
          (args: any) => {
            dispatch(
              assignPendingActions(
                measurementActions.apiGetMeasurementById(measurement.id),
                [],
                [],
                (args: any) => {
                  dispatch(
                    productActions.changeSelectedProductMeasurement(args)
                  );
                  dispatch(controlActions.closeRightPanel());
                },
                (args: any) => {}
              )
            );
          },
          (args: any) => {}
        )
      );
    }
  };

  const createEditedSize = (
    values: SizeInitValues,
    sourceEntity: MeasurementMapSize
  ) => {
    if (measurement && sizeForEdit) {
      const payload = _buildEditedSizePayload(
        values,
        measurement,
        valueItems,
        sizeForEdit
      );

      dispatch(
        assignPendingActions(
          measurementActions.apiUpdateMeasurementSize(payload),
          [],
          [],
          (args: any) => {
            dispatch(
              assignPendingActions(
                measurementActions.apiGetMeasurementById(measurement.id),
                [],
                [],
                (args: any) => {
                  dispatch(
                    productActions.changeSelectedProductMeasurement(args)
                  );
                  dispatch(controlActions.closeRightPanel());
                },
                (args: any) => {}
              )
            );
          },
          (args: any) => {}
        )
      );
    }
  };

  const initValues = _initDefaultValues(sizeForEdit);

  return (
    <div className="sizeForm">
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string().required(() => 'Size name is required'),
          description: Yup.string(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          if (sizeForEdit) createEditedSize(values, sizeForEdit);
          else createNewSize(values);
        }}
        onReset={(values: any, formikHelpers: any) => {
          setValueItems(_initValueItemsDefaults(measurement, sizeForEdit));
        }}
        innerRef={(formik: any) => {
          formikReference.formik = formik;
          if (formik)
            setFormikDirty(
              formik.dirty ||
                new List(valueItems).any((valueItem) =>
                  valueItem.resolveIsDirty()
                )
            );
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
                          // sizeForm__definitionItem
                          <div
                            className={
                              valueItem.isDirty
                                ? 'sizeForm__definitionItem isDirty'
                                : 'sizeForm__definitionItem'
                            }
                            key={index}
                          >
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

                                      const isAnyDirtyChart =
                                        new List(valueItems).any((valueItem) =>
                                          valueItem.resolveIsDirty()
                                        ) || isFormikDirty;

                                      if (isAnyDirtyChart !== isFormikDirty) {
                                        setFormikDirty(isAnyDirtyChart);
                                      }

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
