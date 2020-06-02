import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import {
  FormicReference,
  ProductDeliveryTimelineSelected,
} from '../../../interfaces';
import * as fabricStyles from '../../../common/fabric-styles/styles';

import { useDispatch, useSelector } from 'react-redux';
import {
  DeliveryTimeline,
  ProductDeliveryTimeline,
} from '../../../interfaces/index';
import { IApplicationState } from '../../../redux/reducers';
import { controlActions } from '../../../redux/slices/control.slice';
import {
  GetCommandBarItemProps,
  CommandBarItem,
  ChangeItemsDisabledState,
} from '../../../helpers/commandBar.helper';
import { List } from 'linq-typescript';
import { productActions } from '../../../redux/slices/product.slice';
import { assignPendingActions } from '../../../helpers/action.helper';

const initDefaultValuesForTimelineForm = (sourceEntity?: DeliveryTimeline) => {
  const initValues = new DeliveryTimeline();

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.ivory = sourceEntity.ivory;
    initValues.silver = sourceEntity.silver;
    initValues.black = sourceEntity.black;
    initValues.gold = sourceEntity.gold;
  }
  return initValues;
};

export const ProductDeliverTimelineForm: React.FC = () => {
  const dispatch = useDispatch();

  const selectedDeliveryTimeline = useSelector<
    IApplicationState,
    ProductDeliveryTimelineSelected | null
  >((state) => state.product.choose.selectedTimeline);

  const initValues = initDefaultValuesForTimelineForm(
    selectedDeliveryTimeline?.deliveryTimeline
  );

  const productCategoryId = useSelector<IApplicationState, number | undefined>(
    (state) => state.product.choose.category?.id
  );

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );

  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);

  const buildDeliveryTimeline = (values: any, id?: number) => {
    let result = new ProductDeliveryTimeline();
    let timeline = new DeliveryTimeline();
    if (selectedDeliveryTimeline) {
      timeline = Object.assign({}, selectedDeliveryTimeline.deliveryTimeline);
    }

    timeline.name = values.name;
    timeline.ivory = values.ivory;
    timeline.silver = values.silver;
    timeline.black = values.black;
    timeline.gold = values.gold;

    if (productCategoryId) {
      result.productCategoryId = productCategoryId;
    }
    result.deliveryTimelines.push(timeline);

    return result;
  };

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
  }, [formikReference]);

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
  }, [isFormikDirty]);

  return (
    <div>
      <Formik
        validationSchema={Yup.object().shape({
          name: Yup.string().required(
            () => 'Delivery timeline name is required'
          ),
          ivory: Yup.number().typeError('Must be a number').notRequired(),
          silver: Yup.number().typeError('Must be a number').notRequired(),
          black: Yup.number().typeError('Must be a number').notRequired(),
          gold: Yup.number().typeError('Must be a number').notRequired(),
        })}
        initialValues={initValues}
        onSubmit={(values: any) => {
          if (selectedDeliveryTimeline) {
            let action = assignPendingActions(
              productActions.assignProductDeliveryTimeline(
                buildDeliveryTimeline(values, productCategoryId)
              ),
              [],
              [],
              (args: any) => {
                dispatch(
                  assignPendingActions(
                    productActions.apiGetProductCategoryById(productCategoryId),
                    [],
                    [],
                    (args: any) => {
                      dispatch(productActions.chooseProductCategory(args));
                    },
                    (args: any) => {}
                  )
                );
              },
              (args: any) => {}
            );
            dispatch(action);
          } else {
            let action = assignPendingActions(
              productActions.assignProductDeliveryTimeline(
                buildDeliveryTimeline(values)
              ),
              [],
              [],
              (args: any) => {
                dispatch(
                  assignPendingActions(
                    productActions.apiGetProductCategoryById(productCategoryId),
                    [],
                    [],
                    (args: any) => {
                      dispatch(productActions.chooseProductCategory(args));
                    },
                    (args: any) => {}
                  )
                );
              },
              (args: any) => {}
            );

            dispatch(action);
          }
          dispatch(controlActions.closeRightPanel());
        }}
        innerRef={(formik: any) => {
          formikReference.formik = formik;
          if (formik) {
            setFormikDirty(formik.dirty);
          }
        }}
        validateOnBlur={false}
        enableReinitialize={true}>
        {(formik) => {
          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={1}>
                    <Field name="name">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.name}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Name timeline"
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
                    <Field name="ivory">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.ivory}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Ivory"
                            onChange={(args: any) => {
                              let value = args.target.value;

                              formik.setFieldValue('ivory', value);
                              formik.setFieldTouched('ivory');
                            }}
                            errorMessage={
                              formik.errors.ivory && formik.touched.ivory ? (
                                <span className="form__group__error">
                                  {formik.errors.ivory}
                                </span>
                              ) : (
                                ''
                              )
                            }
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="silver">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.silver}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Silver"
                            onChange={(args: any) => {
                              let value = args.target.value;

                              formik.setFieldValue('silver', value);
                              formik.setFieldTouched('silver');
                            }}
                            errorMessage={
                              formik.errors.silver && formik.touched.silver ? (
                                <span className="form__group__error">
                                  {formik.errors.silver}
                                </span>
                              ) : (
                                ''
                              )
                            }
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="black">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.black}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Black"
                            onChange={(args: any) => {
                              let value = args.target.value;

                              formik.setFieldValue('black', value);
                              formik.setFieldTouched('black');
                            }}
                            errorMessage={
                              formik.errors.black && formik.touched.black ? (
                                <span className="form__group__error">
                                  {formik.errors.black}
                                </span>
                              ) : (
                                ''
                              )
                            }
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="gold">
                      {() => (
                        <div className="form__group">
                          <TextField
                            value={formik.values.gold}
                            styles={fabricStyles.textFildLabelStyles}
                            className="form__group__field"
                            label="Gold"
                            onChange={(args: any) => {
                              let value = args.target.value;

                              formik.setFieldValue('gold', value);
                              formik.setFieldTouched('gold');
                            }}
                            errorMessage={
                              formik.errors.gold && formik.touched.gold ? (
                                <span className="form__group__error">
                                  {formik.errors.gold}
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

export default ProductDeliverTimelineForm;
