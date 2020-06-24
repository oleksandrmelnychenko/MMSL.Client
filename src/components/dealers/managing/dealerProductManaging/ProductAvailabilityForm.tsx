import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, Label } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import { FormicReference } from '../../../../interfaces';
import { ProductCategory } from '../../../../interfaces/products';
import { ProductPermissionSettings } from '../../../../interfaces/products';
import * as fabricStyles from '../../../../common/fabric-styles/styles';
import { List } from 'linq-typescript';
import { useDispatch, useSelector } from 'react-redux';
import { controlActions } from '../../../../redux/slices/control.slice';
import {
  CommandBarItem,
  GetCommandBarItemProps,
  ChangeItemsDisabledState,
} from '../../../../helpers/commandBar.helper';
import { IApplicationState } from '../../../../redux/reducers';
import { DealerAccount } from '../../../../interfaces/dealer';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { dealerProductsActions } from '../../../../redux/slices/dealer/dealerProducts.slice';
import ProductItem, { ProductAssigningContext } from './ProductItem';
import { dealerActions } from '../../../../redux/slices/dealer.slice';

/// Build single hint lable
const _renderHintLable = (textMessage: string): JSX.Element => {
  const result = (
    <Label
      styles={{
        root: {
          fontWeight: 400,
          fontSize: '12px',
          color: '#a19f9d',
        },
      }}
    >
      {textMessage}
    </Label>
  );

  return result;
};

class InitValues {
  constructor() {
    this.products = [];
  }

  products: any[];
}

const _buildPayload = (values: InitValues, dealer: DealerAccount) => {
  let payload: any[] = new List(values.products)
    .select((context: ProductAssigningContext) => {
      const selectResult = {
        productCategoryId: context.getSourceId(),
        dealerAccountId: dealer.id,
        isDisabled: context.isDisabled,
      };

      return selectResult;
    })
    .toArray();

  return payload;
};

const _initDefaultValues = () => {
  const initValues: InitValues = new InitValues();

  return initValues;
};

export const ProductAvailabilityForm: React.FC = () => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);
  const [optionGroupDefaults, setOptionGroupDefaults] = useState<
    ProductCategory[]
  >([]);
  const [productContexts, setProductContexts] = useState<
    ProductAssigningContext[]
  >([]);

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const dealer = useSelector<IApplicationState, DealerAccount | null>(
    (state) => state.dealer.selectedDealer
  );

  useEffect(() => {
    return () => {
      setOptionGroupDefaults([]);
    };
  }, []);

  useEffect(() => {
    updatePanelButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (dealer) {
      dispatch(
        assignPendingActions(
          dealerProductsActions.apiGetDealerProducts(dealer.id),
          [],
          [],
          (args: any[]) => {
            setOptionGroupDefaults(args);
          },
          (args: any) => {
            setOptionGroupDefaults([]);
          }
        )
      );
    } else {
      setOptionGroupDefaults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealer]);

  useEffect(() => {
    setProductContexts(
      new List(optionGroupDefaults)
        .select((product: ProductCategory) => {
          const result = new ProductAssigningContext(product);
          return result;
        })
        .toArray()
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionGroupDefaults]);

  useEffect(() => {
    updatePanelButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productContexts]);

  const updatePanelButtons = () => {
    if (formikReference.formik) {
      dispatch(
        controlActions.setPanelButtons([
          GetCommandBarItemProps(CommandBarItem.Save, () => {
            formikReference.formik.submitForm();
          }),
          GetCommandBarItemProps(CommandBarItem.Reset, () => {
            setOptionGroupDefaults([...optionGroupDefaults]);
            formikReference.formik.resetForm();
          }),
        ])
      );
    }
  };

  const onChangeProductAvailablity = (
    values: InitValues,
    dealer: DealerAccount
  ) => {
    const payload = _buildPayload(values, dealer);

    dispatch(
      assignPendingActions(
        dealerProductsActions.apiUpdateProductsAvailability(payload),
        [],
        [],
        (args: any) => {
          //   dispatch(controlActions.closeRightPanel());
          //   dispatch(controlActions.closeInfoPanelWithComponent());
          //   dispatch(dealerActions.setSelectedDealer(null));

          //   dispatch(controlActions.closeRightPanel());

          if (formikReference.formik) {
            formikReference.formik.resetForm();
          }
          dispatch(dealerActions.setSelectedDealer({ ...dealer }));
        },
        (args: any) => {}
      )
    );
  };

  return (
    <div className="productPermissionForm">
      <Formik
        validationSchema={Yup.object().shape({
          products: Yup.array(),
        })}
        initialValues={_initDefaultValues()}
        onSubmit={(values: any) => {
          /// TODO:
          debugger;
          if (dealer) onChangeProductAvailablity(values, dealer);
        }}
        onReset={(values: any, formikHelpers: any) => {}}
        innerRef={(formik: any) => {
          formikReference.formik = formik;
          if (formik) setFormikDirty(formik.dirty);
        }}
        validateOnBlur={false}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <Form>
              {productContexts.length > 0 ? (
                <Stack wrap={true} horizontal tokens={{ childrenGap: 20 }}>
                  {productContexts.map(
                    (item: ProductAssigningContext, index: number) => (
                      <ProductItem
                        key={index}
                        context={item}
                        changedCallback={(context: ProductAssigningContext) => {
                          const formikDirtyProductsList = new List(
                            formik.values.products as ProductAssigningContext[]
                          );

                          if (context.isDirty()) {
                            if (
                              !formikDirtyProductsList.any(
                                (formikItemContext: ProductAssigningContext) =>
                                  formikItemContext.getSourceId() ===
                                  context.getSourceId()
                              )
                            ) {
                              formik.setFieldValue(
                                'products',
                                formikDirtyProductsList
                                  .concat([context])
                                  .toArray()
                              );
                              formik.setFieldTouched('products');
                            }
                          } else {
                            const restoredContext = formikDirtyProductsList.firstOrDefault(
                              (formikItemContext) =>
                                formikItemContext.getSourceId() ===
                                context.getSourceId()
                            );

                            if (restoredContext) {
                              formikDirtyProductsList.remove(restoredContext);

                              formik.setFieldValue(
                                'products',
                                formikDirtyProductsList.toArray()
                              );
                              formik.setFieldTouched('products');
                            }
                          }
                        }}
                      />
                    )
                  )}
                </Stack>
              ) : (
                _renderHintLable(
                  'There are no available products for this dealer.'
                )
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProductAvailabilityForm;
