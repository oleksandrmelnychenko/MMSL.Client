import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference } from '../../interfaces';
import * as fabricStyles from '../../common/fabric-styles/styles';

import { useDispatch } from 'react-redux';
import { DeliveryTimeline } from '../../interfaces/index';
import { productSettingsActions } from '../../redux/slices/productSettings.slice';

class ManageTimelineFormProps {
  constructor() {
    this.formikReference = new FormicReference();
    this.currentTimeline = null;
    this.submitAction = (args: any) => {};
  }

  formikReference: FormicReference;
  currentTimeline?: DeliveryTimeline | null;
  submitAction: (args: any) => void;
}

const buildDeliveryTimeline = (values: any, sourceEntity?: any) => {
  let timeline = new DeliveryTimeline();

  if (sourceEntity) {
    timeline = { ...sourceEntity };
  }

  timeline.name = values.name;
  timeline.ivory = values.ivory;
  timeline.silver = values.silver;
  timeline.black = values.black;
  timeline.gold = values.gold;

  return timeline;
};

const initDefaultValuesForTimelineForm = (sourceEntity?: DeliveryTimeline) => {
  const initValues = new DeliveryTimeline();

  if (sourceEntity) {
    initValues.name = sourceEntity.name;
    initValues.ivory = sourceEntity.ivory;
    initValues.silver = sourceEntity.silver;
    initValues.black = sourceEntity.black;
    initValues.gold = sourceEntity.gold;
    initValues.id = sourceEntity.id;
  }

  return initValues;
};

export const TimelineForm: React.FC<ManageTimelineFormProps> = (
  props: ManageTimelineFormProps
) => {
  const dispatch = useDispatch();
  const initValues = initDefaultValuesForTimelineForm(
    props.currentTimeline as DeliveryTimeline
  );
  useEffect(() => {
    return () => {
      dispatch(productSettingsActions.clearSelectedDeliveryTimeLine());
    };
  }, []);
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
          props.submitAction(
            buildDeliveryTimeline(values, props.currentTimeline)
          );
        }}
        innerRef={(formik: any) => {
          props.formikReference.formik = formik;
          if (formik) {
            if (props.formikReference.isDirtyFunc)
              props.formikReference.isDirtyFunc(formik.dirty);
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

export default TimelineForm;
