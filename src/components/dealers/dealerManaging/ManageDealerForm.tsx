import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Toggle,
  Dropdown,
  Stack,
  TooltipHost,
  TextField,
  MaskedTextField,
  IDropdownOption,
  DirectionalHint,
  IconButton,
  Text,
  getId,
} from 'office-ui-fabric-react';
import './manageDealerForm.scss';
import * as Yup from 'yup';
import { FormicReference } from '../../../interfaces';
import { DealerAccount } from '../../../interfaces/dealer';
import { PaymentType } from '../../../interfaces/paymentTypes';
import { Currency } from '../../../interfaces/currencyTypes';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import { List } from 'linq-typescript';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { controlActions } from '../../../redux/slices/control.slice';
import {
  CommandBarItem,
  GetCommandBarItemProps,
  ChangeItemsDisabledState,
} from '../../../helpers/commandBar.helper';
import { assignPendingActions } from '../../../helpers/action.helper';
import {
  dealerActions,
  ToggleDealerPanelWithDetails,
} from '../../../redux/slices/dealer.slice';
import { authActions } from '../../../redux/slices/auth.slice';

const _resolveDefaultDropDownValue = (
  limitOptions: any[],
  initLimit: number
) => {
  let result;

  result = new List(limitOptions).firstOrDefault(
    (option) => option.key === `${initLimit}`
  );

  if (result === undefined || null) result = limitOptions[0];

  return result;
};

const _buildEditedDealerPayload = (
  values: any,
  sourceDealer: DealerAccount
) => {
  const updatedDealer: DealerAccount = { ...sourceDealer };

  updatedDealer.companyName = values.companyName;
  updatedDealer.name = values.name;
  updatedDealer.email = values.email;
  updatedDealer.alternateEmail = values.alternativeEmail;
  updatedDealer.phoneNumber = values.phoneNumber;
  updatedDealer.taxNumber = values.taxNumber;
  updatedDealer.isVatApplicable = values.vatApplicate;
  updatedDealer.currencyTypeId = parseInt(values.selectCurrency);
  updatedDealer.paymentTypeId = parseInt(values.selectPayment);
  updatedDealer.isCreditAllowed = values.creditAllowed;

  return updatedDealer;
};

const _buildNewDealerPayload = (values: any) => {
  const newDealerPayload = {
    name: values.name,
    companyName: values.companyName,
    email: values.email,
    alternateEmail: values.alternativeEmail,
    phoneNumber: values.phoneNumber,
    taxNumber: values.taxNumber,
    currencyTypeId: parseInt(values.selectCurrency),
    paymentTypeId: parseInt(values.selectPayment),
    isVatApplicable: values.vatApplicate,
    isCreditAllowed: values.creditAllowed,
    password: values.password,
    id: 0,
  };

  return newDealerPayload;
};

const _initDefaultValues = (account?: DealerAccount | null) => {
  const formikInitValues = {
    companyName: '',
    name: '',
    email: '',
    alternativeEmail: '',
    password: '',
    phoneNumber: '',
    taxNumber: '',
    selectCurrency: '1',
    selectPayment: '1',
    vatApplicate: false,
    creditAllowed: false,
  };

  if (account) {
    formikInitValues.companyName = account.companyName;
    formikInitValues.name = account.name;
    formikInitValues.email = account.email;
    formikInitValues.alternativeEmail = account.alternateEmail;
    formikInitValues.phoneNumber = account.phoneNumber;
    formikInitValues.taxNumber = account.taxNumber;
    formikInitValues.selectCurrency = `${account.currencyTypeId}`;
    formikInitValues.selectPayment = `${account.paymentTypeId}`;
    formikInitValues.vatApplicate = account.isVatApplicable;
    formikInitValues.creditAllowed = account.isCreditAllowed;
    /// TODO: temporary quick implementation
    formikInitValues.password = account.name;
  }

  return formikInitValues;
};

const _currencyOptions = [
  {
    key: '2',
    text: 'USD',
    value: Currency.USD,
  } as IDropdownOption,
  {
    key: '1',
    text: 'EUR',
    value: Currency.EUR,
  } as IDropdownOption,
];

const _paymentOptions = [
  {
    key: '2',
    text: 'Bank transfer',
    value: PaymentType.BankTransfer,
  } as IDropdownOption,
  {
    key: '1',
    text: 'Cash',
    value: PaymentType.Cash,
  } as IDropdownOption,
];

const _buildFormikSchema = (dealer?: DealerAccount | null | undefined) => {
  const shape: any = {
    companyName: Yup.string().required(() => 'Company name is required'),
    name: Yup.string().required(() => 'Name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required(() => 'Email is required'),
    alternativeEmail: Yup.string()
      .email('Invalid email')
      .required('Alternative email is required'),
    phoneNumber: Yup.string().notRequired(),
    taxNumber: Yup.string().notRequired(),
    selectCurrency: Yup.string().notRequired(),
    selectPayment: Yup.string().notRequired(),
    vatApplicate: Yup.boolean().notRequired(),
    creditAllowed: Yup.boolean().notRequired(),
  };

  if (!dealer) shape.password = Yup.string().required('Password is required');

  return Yup.object().shape(shape);
};

export const ManageDealerForm: React.FC = () => {
  const dispatch = useDispatch();

  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);
  const [formWarning, setFormWarning] = useState<string>('');

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const dealerAccount = useSelector<IApplicationState, DealerAccount | null>(
    (state) => state.dealer.selectedDealer
  );

  const dealers = useSelector<IApplicationState, DealerAccount[]>(
    (state) => state.dealer.dealerState.dealersList
  );

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );

  useEffect(() => {
    return () => {
      setFormWarning('');
    };
  }, []);

  useEffect(() => {
    if (formikReference.formik) {
      dispatch(
        controlActions.setPanelButtons([
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            setFormWarning('');
            formikReference.formik.submitForm();
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            setFormWarning('');
            formikReference.formik.resetForm();
          }),
        ])
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormikDirty]);

  const generatePasswordTooltipId = getId();

  const formikInitValues = _initDefaultValues(dealerAccount);

  const onCreateDealer = (formValues: any) => {
    const payload = _buildNewDealerPayload(formValues);

    dispatch(
      assignPendingActions(
        dealerActions.saveNewDealer(payload),
        [],
        [],
        (args: any) => {
          dispatch(
            dealerActions.updateDealersList(
              new List(dealers).concat([args.body]).toArray()
            )
          );

          dispatch(controlActions.closeRightPanel());
          dispatch(controlActions.closeInfoPanelWithComponent());
          dispatch(dealerActions.setSelectedDealer(null));
          dispatch(
            dealerActions.isOpenPanelWithDealerDetails(
              new ToggleDealerPanelWithDetails()
            )
          );
        },
        (args: any) => {
          setFormWarning(args.response.message);
        }
      )
    );
  };

  const onEditDealer = (formValues: any, dealerToEdit: DealerAccount) => {
    const payload = _buildEditedDealerPayload(formValues, dealerToEdit);

    dispatch(
      assignPendingActions(
        dealerActions.updateDealer(payload),
        [],
        [],
        (args: any) => {
          dispatch(
            dealerActions.updateDealersList(
              new List(dealers)
                .select((item) => {
                  let selectResult = item;

                  if (item.id === args.body.id) {
                    selectResult = args.body;
                  }

                  return selectResult;
                })
                .toArray()
            )
          );
          dispatch(controlActions.closeRightPanel());
          dispatch(controlActions.closeInfoPanelWithComponent());
          dispatch(dealerActions.setSelectedDealer(null));
          dispatch(
            dealerActions.isOpenPanelWithDealerDetails(
              new ToggleDealerPanelWithDetails()
            )
          );
        },
        (args: any) => {
          setFormWarning(args.response.message);
        }
      )
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      {formWarning && formWarning.length > 0 ? (
        <Text
          block
          styles={{
            root: {
              position: 'absolute',
              top: '-27px',
              left: '0px',
              color: 'rgb(164, 38, 44)',
              fontSize: '12px',
              maxWidth: '546px',
              maxHeight: '36px',
            },
          }}
        >
          {formWarning}
        </Text>
      ) : null}

      <Formik
        validationSchema={_buildFormikSchema(dealerAccount)}
        initialValues={formikInitValues}
        onSubmit={(values: any) => {
          if (dealerAccount) onEditDealer(values, dealerAccount);
          else onCreateDealer(values);
        }}
        innerRef={(formik: any) => {
          formikReference.formik = formik;

          if (formik) setFormikDirty(formik.dirty);
        }}
        validateOnBlur={false}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <Form className="form">
              <div className="dealerFormManage">
                <Stack horizontal tokens={{ childrenGap: 20 }}>
                  <Stack grow={1}>
                    <Field name="companyName">
                      {() => {
                        return (
                          <div className="form__group">
                            <TextField
                              value={formik.values.companyName}
                              styles={fabricStyles.textFildLabelStyles}
                              className="form__group__field"
                              label="Company name"
                              required
                              onChange={(args: any) => {
                                let value = args.target.value;

                                formik.setFieldValue('companyName', value);
                                formik.setFieldTouched('companyName');
                              }}
                              errorMessage={
                                formik.errors.companyName &&
                                formik.touched.companyName ? (
                                  <span className="form__group__error">
                                    {formik.errors.companyName}
                                  </span>
                                ) : (
                                  ''
                                )
                              }
                            />
                          </div>
                        );
                      }}
                    </Field>
                    <Field name="name">
                      {() => {
                        return (
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
                        );
                      }}
                    </Field>
                    <Field name="email">
                      {() => {
                        return (
                          <div className="form__group">
                            <TextField
                              value={formik.values.email}
                              styles={fabricStyles.textFildLabelStyles}
                              className="form__group__field"
                              label="Email"
                              required
                              onChange={(args: any) => {
                                let value = args.target.value;
                                formik.setFieldValue('email', value);
                                formik.setFieldTouched('email');
                              }}
                              errorMessage={
                                formik.errors.email && formik.touched.email ? (
                                  <span className="form__group__error">
                                    {formik.errors.email}
                                  </span>
                                ) : (
                                  ''
                                )
                              }
                            />
                          </div>
                        );
                      }}
                    </Field>
                    <Field name="alternativeEmail">
                      {() => {
                        return (
                          <div className="form__group">
                            <TextField
                              value={formik.values.alternativeEmail}
                              styles={fabricStyles.textFildLabelStyles}
                              label="Alternative Email"
                              required
                              className="form__group__field"
                              onChange={(args: any) => {
                                let value = args.target.value;
                                formik.setFieldValue('alternativeEmail', value);
                                formik.setFieldTouched('alternativeEmail');
                              }}
                              errorMessage={
                                formik.errors.alternativeEmail &&
                                formik.touched.alternativeEmail ? (
                                  <span className="form__group__error">
                                    {formik.errors.alternativeEmail}
                                  </span>
                                ) : (
                                  ''
                                )
                              }
                            />
                          </div>
                        );
                      }}
                    </Field>

                    {dealerAccount ? null : (
                      <Field name="password">
                        {() => {
                          return (
                            <div className="form__group">
                              <Stack horizontal tokens={{ childrenGap: '6px' }}>
                                <Stack.Item grow={1}>
                                  <TextField
                                    value={formik.values.password}
                                    styles={fabricStyles.textFildLabelStyles}
                                    label="Password"
                                    required
                                    className="form__group__field"
                                    onChange={(args: any) => {
                                      let value = args.target.value;
                                      formik.setFieldValue('password', value);
                                      formik.setFieldTouched('password');
                                    }}
                                    errorMessage={
                                      formik.errors.password &&
                                      formik.touched.password ? (
                                        <span className="form__group__error">
                                          {formik.errors.password}
                                        </span>
                                      ) : (
                                        ''
                                      )
                                    }
                                  />
                                </Stack.Item>

                                <Stack.Item align="end">
                                  <TooltipHost
                                    content="Auto Generate password"
                                    directionalHint={
                                      DirectionalHint.bottomRightEdge
                                    }
                                    id={generatePasswordTooltipId}
                                    calloutProps={{ gapSpace: 0 }}
                                    styles={{
                                      root: { display: 'inline-block' },
                                    }}
                                  >
                                    <IconButton
                                      iconProps={{
                                        iconName: 'PasswordField',
                                      }}
                                      onClick={() => {
                                        dispatch(
                                          assignPendingActions(
                                            authActions.apiGeneratePassword(),
                                            [],
                                            [],
                                            (args: any) => {
                                              formik.setFieldValue(
                                                'password',
                                                args
                                              );
                                              formik.setFieldTouched(
                                                'password'
                                              );
                                            },
                                            (args: any) => {}
                                          )
                                        );
                                      }}
                                      styles={{
                                        root:
                                          formik.errors.password &&
                                          formik.touched.password
                                            ? { marginBottom: '5px' }
                                            : {},
                                      }}
                                    />
                                  </TooltipHost>
                                </Stack.Item>
                              </Stack>
                            </div>
                          );
                        }}
                      </Field>
                    )}

                    <Field name="phoneNumber">
                      {() => {
                        return (
                          <div className="form__group">
                            <MaskedTextField
                              value={formik.values.phoneNumber}
                              styles={fabricStyles.textFildLabelStyles}
                              className="form__group__field"
                              label="Phone Number"
                              mask="(999) 999 - 9999"
                              onChange={(args: any) => {
                                let value = args.target.value;
                                formik.setFieldValue('phoneNumber', value);
                                formik.setFieldTouched('phoneNumber');
                              }}
                            />
                          </div>
                        );
                      }}
                    </Field>
                    <Field name="taxNumber">
                      {() => {
                        return (
                          <div className="form__group">
                            <TextField
                              value={formik.values.taxNumber}
                              styles={fabricStyles.textFildLabelStyles}
                              label="Tax Number"
                              className="form__group__field"
                              onChange={(args: any) => {
                                let value = args.target.value;
                                formik.setFieldValue('taxNumber', value);
                                formik.setFieldTouched('taxNumber');
                              }}
                            />
                          </div>
                        );
                      }}
                    </Field>
                  </Stack>
                  <Stack grow={1}>
                    <Field name="selectCurrency">
                      {() => {
                        return (
                          <div className="form__group">
                            <Dropdown
                              defaultSelectedKey={
                                _resolveDefaultDropDownValue(
                                  _currencyOptions,
                                  parseInt(formik.values.selectCurrency)
                                ).key
                              }
                              className="form__group__field"
                              label="Select Currency"
                              options={_currencyOptions}
                              styles={fabricStyles.dropDownStyles}
                              onChange={(
                                event: React.FormEvent<HTMLDivElement>,
                                item: any
                              ) => {
                                let value = item.value;
                                formik.setFieldValue('selectCurrency', value);
                                formik.setFieldTouched('selectCurrency');
                              }}
                            />
                          </div>
                        );
                      }}
                    </Field>

                    <Field name="selectPayment">
                      {() => {
                        return (
                          <div className="form__group">
                            <Dropdown
                              className="form__group__field"
                              label="Select Payment"
                              options={_paymentOptions}
                              defaultSelectedKey={
                                _resolveDefaultDropDownValue(
                                  _paymentOptions,
                                  parseInt(formik.values.selectPayment)
                                ).key
                              }
                              styles={fabricStyles.dropDownStyles}
                              onChange={(
                                event: React.FormEvent<HTMLDivElement>,
                                item: any
                              ) => {
                                let value = item.value;
                                formik.setFieldValue('selectPayment', value);
                                formik.setFieldTouched('selectPayment');
                              }}
                            />
                          </div>
                        );
                      }}
                    </Field>

                    <Field name="vatApplicate">
                      {() => {
                        return (
                          <div className="form__group">
                            <Toggle
                              checked={formik.values.vatApplicate}
                              styles={fabricStyles.toggleStyles}
                              className="form__group__field"
                              label="Vat Applicate"
                              inlineLabel
                              onText="On"
                              offText="Off"
                              onChange={(checked: any, isChecked: any) => {
                                formik.setFieldValue('vatApplicate', isChecked);
                                formik.setFieldTouched('vatApplicate');
                              }}
                            />
                          </div>
                        );
                      }}
                    </Field>

                    <Field name="creditAllowed">
                      {() => {
                        return (
                          <div className="form__group">
                            <Toggle
                              checked={formik.values.creditAllowed}
                              className="form__group__field"
                              label="Credit Allowed"
                              styles={fabricStyles.toggleStyles}
                              inlineLabel
                              onText="On"
                              offText="Off"
                              onChange={(checked: any, isChecked: any) => {
                                formik.setFieldValue(
                                  'creditAllowed',
                                  isChecked
                                );
                                formik.setFieldTouched('creditAllowed');
                              }}
                            />
                          </div>
                        );
                      }}
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

export default ManageDealerForm;
