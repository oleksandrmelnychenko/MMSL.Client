import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Stack,
  TextField,
  Dropdown,
  Text,
  IDropdownOption,
  Separator,
} from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference } from '../../../../../../interfaces';
import {
  Measurement,
  MeasurementMapDefinition,
  MeasurementMapSize,
  MeasurementMapValue,
} from '../../../../../../interfaces/measurements';
import * as fabricStyles from '../../../../../../common/fabric-styles/styles';
import './fittingTypeForm.scss';
import { List } from 'linq-typescript';
import { controlActions } from '../../../../../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetCommandBarItemProps,
  CommandBarItem,
  ChangeItemsDisabledState,
} from '../../../../../../helpers/commandBar.helper';
import { IApplicationState } from '../../../../../../redux/reducers';
import {
  FittingType,
  MeasurementUnit,
} from '../../../../../../interfaces/fittingTypes';
import { fittingTypesActions } from '../../../../../../redux/slices/measurements/fittingTypes.slice';
import { assignPendingActions } from '../../../../../../helpers/action.helper';
import { unitsOfMeasurementActions } from '../../../../../../redux/slices/measurements/unitsOfMeasurement.slice';

export interface IFittingTypeInitValues {
  type: string;
  unitOfMeasurement: MeasurementUnit | null | undefined;
}

const _buildNewFittingTypePayload = (
  values: IFittingTypeInitValues,
  measurement: Measurement,
  valueItems: DefinitionValueItem[]
) => {
  const fittingTypePayload: any = {
    type: values.type,
    measurementUnitId: values.unitOfMeasurement
      ? values.unitOfMeasurement.id
      : 0,
    measurementId: measurement.id,
    valueDataContracts: [],
  };

  /// TODO: vadymk don't repeat your self (Size Form use same entity and approach,
  /// define shared helper for this flow)
  const dirtyValueItemsList = new List<DefinitionValueItem>(
    valueItems
  ).where((item) => item.resolveIsDirty());

  /// TODO: vadymk don't repeat your self (Size Form use same entity and approach,
  /// define shared helper for this flow)
  fittingTypePayload.valueDataContracts = dirtyValueItemsList
    .select((valueItem) => {
      return {
        measurementDefinitionId:
          valueItem.sourceMapDefinition.measurementDefinitionId,
        value: parseFloat(valueItem.value),
      };
    })
    .where((itemContract) => !isNaN(itemContract.value))
    .toArray();

  return fittingTypePayload;
};

const _buildEditedFittingTypePayload = (
  values: IFittingTypeInitValues,
  measurement: Measurement,
  valueItems: DefinitionValueItem[],
  sourceEntity: FittingType
) => {
  const fittingTypePayload: any = { ...sourceEntity };
  fittingTypePayload.type = values.type;

  fittingTypePayload.measurementUnitId = values.unitOfMeasurement?.id;
  fittingTypePayload.measurementUnit = values.unitOfMeasurement;

  /// TODO: vadymk don't repeat your self (Size Form use same entity and approach,
  /// define shared helper for this flow)
  const dirtyValueItemsList = new List<DefinitionValueItem>(
    valueItems
  ).where((item) => item.resolveIsDirty());

  /// TODO: vadymk don't repeat your self (Size Form use same entity and approach,
  /// define shared helper for this flow)
  fittingTypePayload.measurementMapValues = dirtyValueItemsList
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

  return fittingTypePayload;
};

const _initDefaultValues = (
  unitsOfMeasurement: IDropdownOption[],
  sourceEntity?: FittingType | null | undefined
) => {
  const initValues: IFittingTypeInitValues = {
    type: '',
    unitOfMeasurement:
      unitsOfMeasurement.length > 1
        ? (unitsOfMeasurement[0] as any).unitOfMeasurement
        : null,
  };

  if (sourceEntity) {
    initValues.type = sourceEntity.type;
  }

  return initValues;
};

const _initValueItemsDefaults = (
  measurement: Measurement | null | undefined,
  sourceEntity?: FittingType | null | undefined
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

          if (sourceEntity?.measurementMapValues) {
            const targetMapValue:
              | MeasurementMapValue
              | null
              | undefined = new List<MeasurementMapValue>(
              sourceEntity.measurementMapValues
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

const _resolveDefaultSelectedOptionKey = (
  options: IDropdownOption[],
  fittingTypeForEdit?: FittingType | null | undefined
) => {
  let defaultSelectKey: string = '';

  if (fittingTypeForEdit) {
    defaultSelectKey = `${fittingTypeForEdit.measurementUnitId}`;
  } else {
    defaultSelectKey = options.length > 0 ? `${options[0].key}` : '';
  }

  return defaultSelectKey;
};

/// TODO: vadymk don't repeat your self (Size Form use same entity and approach,
/// define shared helper for this flow)
class DefinitionValueItem {
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

export const FittingTypeForm: React.FC = () => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);
  const [unitsOfMeasurement, setUnitsOfMeasurement] = useState<
    IDropdownOption[]
  >([]);
  const [valueItems, setValueItems] = useState<DefinitionValueItem[]>([]);

  const measurement = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.product.productMeasurementsState.targetMeasurement);

  const fittingTypeForEdit = useSelector<
    IApplicationState,
    FittingType | null | undefined
  >((state) => state.fittingTypes.fittingTypeForEdit);

  const fittingTypes = useSelector<IApplicationState, FittingType[]>(
    (state) => state.fittingTypes.fittingTypes
  );

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
            setUnitsOfMeasurement([...unitsOfMeasurement]);
            formikReference.formik.resetForm();
          }),
        ])
      );
    }
  }, [formikReference, unitsOfMeasurement, dispatch]);

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
    setValueItems(_initValueItemsDefaults(measurement, fittingTypeForEdit));

    dispatch(
      assignPendingActions(
        unitsOfMeasurementActions.apiGetAllUnitsOfMeasurement(),
        [],
        [],
        (args: any) => {
          setUnitsOfMeasurement(
            args.map((unit: MeasurementUnit, index: number) => {
              return {
                key: `${unit.id}`,
                text: unit.description,
                // isSelected: index === 0,
                unitOfMeasurement: unit,
              } as IDropdownOption;
            })
          );
        },
        (args: any) => {}
      )
    );

    return () => {
      dispatch(fittingTypesActions.changeFittingTypeForEdit(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newFittingType = (values: IFittingTypeInitValues) => {
    if (measurement) {
      const payload = _buildNewFittingTypePayload(
        values,
        measurement,
        valueItems
      );

      dispatch(
        assignPendingActions(
          fittingTypesActions.apiCreateFittingType(payload),
          [],
          [],
          (args: any) => {
            if (measurement) {
              dispatch(
                fittingTypesActions.changeFittingTypes(
                  new List(fittingTypes).concat([args.body]).toArray()
                )
              );
            } else {
              dispatch(fittingTypesActions.changeFittingTypes([]));
            }

            dispatch(controlActions.closeRightPanel());
          },
          (args: any) => {}
        )
      );
    }
  };

  const editFittingType = (
    values: IFittingTypeInitValues,
    sourceEntity: FittingType
  ) => {
    if (measurement && fittingTypeForEdit) {
      const payload = _buildEditedFittingTypePayload(
        values,
        measurement,
        valueItems,
        fittingTypeForEdit
      );

      dispatch(
        assignPendingActions(
          fittingTypesActions.apiUpdateFittingType(payload),
          [],
          [],
          (args: any) => {
            dispatch(
              fittingTypesActions.changeFittingTypes(
                new List(fittingTypes)
                  .select((item) => {
                    let selectResult = item;

                    if (item.id === args.body.id) selectResult = args.body;

                    return selectResult;
                  })
                  .toArray()
              )
            );
            dispatch(controlActions.closeRightPanel());
          },
          (args: any) => {}
        )
      );
    }
  };

  const initValues = _initDefaultValues(unitsOfMeasurement, fittingTypeForEdit);

  return (
    <div className="fittingTypeForm">
      <Formik
        validationSchema={Yup.object().shape({
          type: Yup.string().required(() => 'Type is required'),
          unitOfMeasurement: Yup.object()
            .nullable()
            .required('Unit of measurement is required'),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          if (fittingTypeForEdit) editFittingType(values, fittingTypeForEdit);
          else newFittingType(values);
        }}
        onReset={(values: any, formikHelpers: any) => {
          setValueItems(
            _initValueItemsDefaults(measurement, fittingTypeForEdit)
          );
        }}
        innerRef={(formik: any) => {
          formikReference.formik = formik;
          if (formik) {
            setFormikDirty(
              formik.dirty ||
                new List(valueItems).any((valueItem) =>
                  valueItem.resolveIsDirty()
                )
            );
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
                    <Field name="type">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.type}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Type"
                            required
                            onChange={(args: any) => {
                              let value = args.target.value;

                              formik.setFieldValue('type', value);
                              formik.setFieldTouched('type');
                            }}
                            errorMessage={
                              formik.errors.type && formik.touched.type ? (
                                <span className="form__group__error">
                                  {formik.errors.type}
                                </span>
                              ) : (
                                ''
                              )
                            }
                          />
                        </div>
                      )}
                    </Field>

                    <Field name="unitOfMeasurement">
                      {() => (
                        <div className="form__group">
                          <Dropdown
                            defaultSelectedKey={_resolveDefaultSelectedOptionKey(
                              unitsOfMeasurement,
                              fittingTypeForEdit
                            )}
                            placeholder="Coose chart view"
                            label="Chart View"
                            options={unitsOfMeasurement}
                            styles={fabricStyles.comboBoxStyles}
                            onChange={(
                              event: React.FormEvent<HTMLDivElement>,
                              option?: IDropdownOption,
                              index?: number
                            ) => {
                              if (option) {
                                formik.setFieldValue(
                                  'unitOfMeasurement',
                                  (option as any).unitOfMeasurement
                                );
                                formik.setFieldTouched('unitOfMeasurement');
                              }
                            }}
                          />
                        </div>
                      )}
                    </Field>
                  </Stack>

                  {/* TODO: vadymk don't repeat your self (Size Form use same entity
                  and approach, define shared helper for this flow) */}
                  <Stack tokens={{ childrenGap: '6px' }}>
                    <Separator alignContent="start">Columns (charts)</Separator>
                    {valueItems.map(
                      (valueItem: DefinitionValueItem, index: number) => {
                        return (
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

export default FittingTypeForm;
