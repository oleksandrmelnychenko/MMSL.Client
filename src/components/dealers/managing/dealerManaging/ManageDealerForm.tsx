import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import {
  Stack,
  TooltipHost,
  IDropdownOption,
  DirectionalHint,
  IconButton,
  Text,
  getId,
} from 'office-ui-fabric-react';
import './manageDealerForm.scss';
import * as Yup from 'yup';
import { FormicReference } from '../../../../interfaces';
import { DealerAccount } from '../../../../interfaces/dealer';
import { PaymentType } from '../../../../interfaces/paymentTypes';
import { Currency } from '../../../../interfaces/currencyTypes';
import { List } from 'linq-typescript';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../../redux/reducers';
import { controlActions } from '../../../../redux/slices/control.slice';
import { rightPanelActions } from '../../../../redux/slices/rightPanel.slice';
import {
  CommandBarItem,
  GetCommandBarItemProps,
  ChangeItemsDisabledState,
} from '../../../../helpers/commandBar.helper';
import { assignPendingActions } from '../../../../helpers/action.helper';
import {
  dealerActions,
  ToggleDealerPanelWithDetails,
} from '../../../../redux/slices/dealer.slice';
import { authActions } from '../../../../redux/slices/auth.slice';
import Entry from '../../../../common/formFields/Entry';
import MaskedEntry from '../../../../common/formFields/MaskedEntry';
import FormDropdown from '../../../../common/formFields/FormDropdown';
import FormToggle from '../../../../common/formFields/FormToggle';

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
    (state) => state.rightPanel.rightPanel.commandBarItems
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
        rightPanelActions.setPanelButtons([
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
        rightPanelActions.setPanelButtons(
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

          dispatch(rightPanelActions.closeRightPanel());
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
          dispatch(rightPanelActions.closeRightPanel());
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
                    <Entry
                      fieldName="companyName"
                      formik={formik}
                      label={'Company name'}
                      isRequired
                    />

                    <Entry
                      fieldName="name"
                      formik={formik}
                      label={'Name'}
                      isRequired
                    />

                    <Entry
                      fieldName="email"
                      formik={formik}
                      label={'Email'}
                      isRequired
                    />

                    <Entry
                      fieldName="alternativeEmail"
                      formik={formik}
                      label={'Alternative Email'}
                      isRequired
                    />

                    {dealerAccount ? null : (
                      <Stack horizontal tokens={{ childrenGap: '6px' }}>
                        <Stack.Item grow={1}>
                          <Entry
                            fieldName="password"
                            formik={formik}
                            label={'Password'}
                            isRequired
                          />
                        </Stack.Item>

                        <Stack.Item align="end">
                          <TooltipHost
                            content="Auto Generate password"
                            directionalHint={DirectionalHint.bottomRightEdge}
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
                                      formik.setFieldValue('password', args);
                                      formik.setFieldTouched('password');
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
                    )}

                    <MaskedEntry
                      fieldName="phoneNumber"
                      formik={formik}
                      label={'Phone Number'}
                      isRequired={false}
                      mask="(999) 999 - 9999"
                    />

                    <Entry
                      fieldName="taxNumber"
                      formik={formik}
                      label={'Tax Number'}
                      isRequired={false}
                    />
                  </Stack>

                  <Stack grow={1}>
                    <FormDropdown
                      formik={formik}
                      label={'Select Currency'}
                      fieldName={'selectCurrency'}
                      options={_currencyOptions}
                      resolveOnChangeValue={(
                        option: IDropdownOption | null | undefined
                      ) => (option ? (option as any).key : '')}
                      resolveSelectedKeyValue={(formValue: any) =>
                        formValue ? formValue : ''
                      }
                    />

                    <FormDropdown
                      formik={formik}
                      label={'Select Payment'}
                      fieldName={'selectPayment'}
                      options={_paymentOptions}
                      resolveOnChangeValue={(
                        option: IDropdownOption | null | undefined
                      ) => (option ? (option as any).key : '')}
                      resolveSelectedKeyValue={(formValue: any) =>
                        formValue ? formValue : ''
                      }
                    />

                    <FormToggle
                      formik={formik}
                      label="Vat Applicate"
                      fieldName={'vatApplicate'}
                    />

                    <FormToggle
                      formik={formik}
                      label="Credit Allowed"
                      fieldName={'creditAllowed'}
                    />
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
