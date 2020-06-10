import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import {
  FormicReference,
  Measurement,
  MeasurementMapDefinition,
} from '../../../../interfaces';
import { ProductCategory } from '../../../../interfaces/products';
import * as fabricStyles from '../../../../common/fabric-styles/styles';
import './measurementForm.scss';
import { List } from 'linq-typescript';
import { useDispatch, useSelector } from 'react-redux';
import { controlActions } from '../../../../redux/slices/control.slice';
import {
  CommandBarItem,
  GetCommandBarItemProps,
  ChangeItemsDisabledState,
} from '../../../../helpers/commandBar.helper';
import { IApplicationState } from '../../../../redux/reducers';
import NewNamedItemInput from './NewNamedItemInput';
import EditChartItem, {
  IChartItemInputState,
  ChartItemInitPayload,
} from './EditChartItem';
import { measurementActions } from '../../../../redux/slices/measurement.slice';
import { productActions } from '../../../../redux/slices/product.slice';
import { assignPendingActions } from '../../../../helpers/action.helper';
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
  Droppable,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableRubric,
} from 'react-beautiful-dnd';

class MeasurementFormInitValues {
  constructor() {
    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}

const _buildNewMeasurementPayload = (
  values: MeasurementFormInitValues,
  charts: ChartItemInitPayload[],
  productCategory: ProductCategory
) => {
  let payload: any = {
    productCategoryId: productCategory!.id,
    name: values.name,
    description: values.description,
    measurementDefinitions: [],
  };

  payload.measurementDefinitions = new List(charts)
    .select((item: ChartItemInitPayload) => {
      return {
        name: item.name,
        orderIndex: item.orderIndex,
        id: 0,
      };
    })
    .toArray();

  return payload;
};

const _buildEditedMeasurementPayload = (
  values: MeasurementFormInitValues,
  charts: ChartItemInitPayload[],
  sourceEntity: Measurement
) => {
  let payload: any = {
    id: sourceEntity.id,
    name: values.name,
    description: values.description,
    measurementDefinitions: [],
  };

  payload.measurementDefinitions = new List(charts)
    .select((item: ChartItemInitPayload) => {
      return {
        id: item.rawSource.measurementDefinition.id,
        orderIndex: item.orderIndex,
        name: item.name,
        isDeleted: item.isDeleted,
        mapId: item.rawSource.id,
      };
    })
    .toArray();

  return payload;
};

const _initDefaultValues = (sourceEntity?: Measurement | null) => {
  const initValues: MeasurementFormInitValues = new MeasurementFormInitValues();

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.description = sourceEntity.description
      ? sourceEntity.description
      : '';
  }

  return initValues;
};

const _initDefaultCharts = (sourceEntity?: Measurement | null) => {
  let defaults: any[] = [];

  if (sourceEntity?.measurementMapDefinitions) {
    defaults = new List(sourceEntity.measurementMapDefinitions)
      .select<ChartItemInitPayload>((itemMap: MeasurementMapDefinition) => {
        const resultItem = new ChartItemInitPayload();
        resultItem.isDeleted = itemMap.measurementDefinition.isDeleted;
        resultItem.name = itemMap.measurementDefinition.name;
        resultItem.orderIndex = itemMap.orderIndex;
        resultItem.rawSource = itemMap;

        return resultItem;
      })
      .orderBy((item: ChartItemInitPayload) => item.orderIndex)
      .toArray();
  }

  return defaults;
};

const _isChartItemDirty: (item: ChartItemInitPayload) => boolean = (
  item: ChartItemInitPayload
) => {
  let isDirty = false;

  if (
    item.rawSource.id === 0 ||
    item.rawSource.measurementDefinition.name !== item.name ||
    item.rawSource.measurementDefinition.isDeleted !== item.isDeleted ||
    item.rawSource.orderIndex !== item.orderIndex
  )
    isDirty = true;

  return isDirty;
};

export const MeasurementForm: React.FC = () => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);
  const [charts, setCharts] = useState<ChartItemInitPayload[]>([]);
  const [deletedCharts, setDeletedCharts] = useState<ChartItemInitPayload[]>(
    []
  );

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const measurements = useSelector<IApplicationState, Measurement[]>(
    (state) => state.product.productMeasurementsState.measurementList
  );

  const productCategory = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const measurementToEdit = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.product.productMeasurementsState.measurementForEdit);

  useEffect(() => {
    setCharts(_initDefaultCharts(measurementToEdit));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const createNewRowItem = (nameInput: string) => {
    if (nameInput) {
      const newRowDefinition = new ChartItemInitPayload();

      newRowDefinition.name = nameInput;
      newRowDefinition.isDeleted = false;
      newRowDefinition.rawSource = new MeasurementMapDefinition();

      setCharts(new List(charts).concat([newRowDefinition]).toArray());
    }
  };

  const tryDeleteItem = (
    itemToDelete: ChartItemInitPayload,
    inputState: IChartItemInputState
  ) => {
    if (inputState.name.length < 1 || inputState.isRemoved) {
      const rowList = new List(charts);
      rowList.remove(itemToDelete);

      if (itemToDelete.rawSource && itemToDelete.rawSource.id !== 0) {
        const toDelete = new List(deletedCharts);

        if (
          !toDelete.any(
            (deletedRow) =>
              deletedRow.rawSource.id === itemToDelete.rawSource.id
          )
        ) {
          itemToDelete.isDeleted = true;
          setDeletedCharts(toDelete.concat([itemToDelete]).toArray());
        }
      }

      setCharts(rowList.toArray());
    }
  };

  const editMeasurement = (values: MeasurementFormInitValues) => {
    if (productCategory && measurementToEdit) {
      const payload = _buildEditedMeasurementPayload(
        values,
        new List(charts)
          .concat(deletedCharts)
          .where((item) => _isChartItemDirty(item))
          .toArray(),
        measurementToEdit
      );
      dispatch(
        assignPendingActions(
          measurementActions.apiUpdateMeasurement(payload),
          [],
          [],
          (args: any) => {
            const listo = new List(measurements)
              .select((item) => {
                let result = item;

                if (item.id === args.body.id) {
                  result = args.body;
                }

                return result;
              })
              .toArray();

            dispatch(productActions.updateProductMeasurementsList(listo));
            dispatch(
              productActions.changeSelectedProductMeasurement(args.body)
            );
            dispatch(productActions.changeProductMeasurementForEdit(null));
            dispatch(controlActions.closeRightPanel());
          },
          (args: any) => {}
        )
      );
    }
  };

  const createNewMeasurement = (values: MeasurementFormInitValues) => {
    if (productCategory) {
      const payload = _buildNewMeasurementPayload(
        values,
        new List(charts)
          .concat(deletedCharts)
          .where((item) => _isChartItemDirty(item))
          .toArray(),
        productCategory
      );
      dispatch(
        assignPendingActions(
          measurementActions.apiCreateNewMeasurement(payload),
          [],
          [],
          (args: any) => {
            dispatch(
              productActions.updateProductMeasurementsList(
                new List(measurements).concat([args.body]).toArray()
              )
            );
            dispatch(
              productActions.changeSelectedProductMeasurement(args.body)
            );
            dispatch(controlActions.closeRightPanel());
          },
          (args: any) => {}
        )
      );
    }
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) return;

    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    )
      return;

    const changetOrder = Array.from(charts);
    const item = changetOrder[result.source.index];
    changetOrder.splice(result.source.index, 1);
    changetOrder.splice(result.destination.index, 0, item);
    changetOrder.forEach((item, index) => {
      item.orderIndex = index;
    });

    setCharts(changetOrder);
  };

  const onRenderDroppableClone = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric
  ) => {
    const overriddenProps = {
      ...provided.draggableProps,
      style: {
        ...provided.draggableProps.style,
        zIndex: 1000001,
      },
    };
    return (
      <div
        {...overriddenProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
      >
        <EditChartItem
          payload={charts[rubric.source.index]}
          isDirtyCheck={() => true}
          onEditCompleted={(inputState: IChartItemInputState) => {}}
        />
      </div>
    );
  };

  const onRenderDraggable = (
    item: ChartItemInitPayload,
    index: number,
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric
  ) => {
    return (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
      >
        <EditChartItem
          payload={item}
          isDirtyCheck={() => _isChartItemDirty(item)}
          onEditCompleted={(inputState: IChartItemInputState) => {
            item.name = inputState.name;
            item.isDeleted = inputState.isRemoved;

            tryDeleteItem(item, inputState);

            const isAnyDirtyChart =
              new List(charts).any((_) => _isChartItemDirty(_)) ||
              isFormikDirty;

            if (isAnyDirtyChart !== isFormikDirty) {
              setFormikDirty(isAnyDirtyChart);
            }
          }}
        />
      </div>
    );
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
        initialValues={_initDefaultValues(measurementToEdit)}
        onSubmit={(values: any) => {
          if (measurementToEdit) editMeasurement(values);
          else createNewMeasurement(values);
        }}
        onReset={(values: any, formikHelpers: any) => {
          setCharts(_initDefaultCharts(measurementToEdit));
          setDeletedCharts([]);
        }}
        innerRef={(formik: any) => {
          formikReference.formik = formik;
          if (formik)
            setFormikDirty(
              formik.dirty ||
                new List(charts)
                  .concat(deletedCharts)
                  .any((item) => _isChartItemDirty(item))
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
                            formik.setFieldValue('name', args.target.value);
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
                  <Stack>
                    <NewNamedItemInput
                      label="New column"
                      onReleaseInputCallback={(input: string) =>
                        createNewRowItem(input)
                      }
                    />

                    <Stack tokens={{ childrenGap: '12px' }}>
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable
                          droppableId={'0'}
                          renderClone={onRenderDroppableClone}
                        >
                          {(droppableProvided) => {
                            return (
                              <div
                                {...droppableProvided.droppableProps}
                                ref={droppableProvided.innerRef}
                              >
                                <Stack tokens={{ childrenGap: '6px' }}>
                                  {charts.map((item, index) => {
                                    return (
                                      <div key={index}>
                                        <Draggable
                                          draggableId={`${index}`}
                                          index={index}
                                        >
                                          {(
                                            provided: DraggableProvided,
                                            snapshot: DraggableStateSnapshot,
                                            rubric: DraggableRubric
                                          ) => {
                                            return onRenderDraggable(
                                              item,
                                              index,
                                              provided,
                                              snapshot,
                                              rubric
                                            );
                                          }}
                                        </Draggable>
                                      </div>
                                    );
                                  })}
                                  {droppableProvided.placeholder}
                                </Stack>
                              </div>
                            );
                          }}
                        </Droppable>
                      </DragDropContext>
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
