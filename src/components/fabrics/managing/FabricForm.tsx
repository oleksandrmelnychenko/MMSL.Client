import React, { useState, useEffect } from 'react';
import { IApplicationState } from '../../../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { Fabric, FabricStatuses } from '../../../interfaces/fabric';
import { FormicReference } from '../../../interfaces';
import { fabricActions } from '../../../redux/slices/store/fabric/fabric.slice';
import { controlActions } from '../../../redux/slices/control.slice';
import {
  GetCommandBarItemProps,
  CommandBarItem,
  ChangeItemsDisabledState,
} from '../../../helpers/commandBar.helper';
import { List } from 'linq-typescript';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Stack, IDropdownOption } from 'office-ui-fabric-react';
import Entry from '../../../common/formFields/Entry';
import FormDropdown from '../../../common/formFields/FormDropdown';
import FormImageAttachemnt from '../../../common/formFields/FormImageAttachemnt';
import { assignPendingActions } from '../../../helpers/action.helper';

export interface IFormValues {
  fabricCode: string;
  description: string;
  status: FabricStatuses;
  composition: string;
  pattern: string;
  metres: string;
  weave: string;
  color: string;
  mill: string;
  gSM: string;
  count: number;

  imageFile: any | null;
  fieldExternalImageURL: string;
}

const _statuses = [
  {
    key: `${FabricStatuses.InStock}`,
    text: 'In Stock',
    status: FabricStatuses.InStock,
  } as IDropdownOption,
  {
    key: `${FabricStatuses.OutOfStock}`,
    text: 'Out of Stock',
    status: FabricStatuses.OutOfStock,
  } as IDropdownOption,
  {
    key: `${FabricStatuses.Discontinued}`,
    text: 'Discontinued',
    status: FabricStatuses.Discontinued,
  } as IDropdownOption,
];

const _initDefaultValues = (sourceEntity: Fabric | null | undefined) => {
  const initValues: IFormValues = {
    fabricCode: '',
    description: '',
    status: FabricStatuses.InStock,
    composition: '',
    pattern: '',
    metres: '',
    weave: '',
    color: '',
    mill: '',
    gSM: '',
    count: 0,
    imageFile: null,
    fieldExternalImageURL: '',
  };

  if (sourceEntity) {
    initValues.fabricCode = sourceEntity.fabricCode;
    initValues.description = sourceEntity.description;
    initValues.status = sourceEntity.status;
    initValues.composition = sourceEntity.composition;
    initValues.pattern = sourceEntity.pattern;
    initValues.metres = sourceEntity.metres;
    initValues.weave = sourceEntity.weave;
    initValues.color = sourceEntity.color;
    initValues.mill = sourceEntity.mill;
    initValues.gSM = sourceEntity.gsm;
    initValues.count = sourceEntity.count;
    initValues.imageFile = null;
    initValues.fieldExternalImageURL = sourceEntity.imageUrl;
  }

  return initValues;
};

const _buildNewPayload = (values: IFormValues) => {
  let payload: any = {
    fabricCode: values.fabricCode,
    description: values.description,
    status: values.status,
    composition: values.composition,
    pattern: values.pattern,
    metres: values.metres,
    weave: values.weave,
    color: values.color,
    mill: values.mill,
    gSM: values.gSM,
    count: parseInt(`${values.count}`),
    imageFile: values.imageFile,
  };

  if (isNaN(payload.count)) payload.count = 0;

  return payload;
};

const _buildEditedPayload = (values: IFormValues, sourceEntity: Fabric) => {
  let payload: any = {
    fabricCode: values.fabricCode,
    description: values.description,
    status: values.status,
    composition: values.composition,
    pattern: values.pattern,
    metres: values.metres,
    weave: values.weave,
    color: values.color,
    mill: values.mill,
    gSM: values.gSM,
    count: parseInt(`${values.count}`),
    imageFile: values.imageFile,
    imageUrl: values.fieldExternalImageURL ? values.fieldExternalImageURL : '',
    id: sourceEntity.id,
  };

  if (isNaN(payload.count)) payload.count = 0;

  return payload;
};

const FabricForm: React.FC = () => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {})
  );
  const [isFormikDirty, setFormikDirty] = useState<boolean>(false);

  const commandBarItems = useSelector<IApplicationState, any>(
    (state) => state.control.rightPanel.commandBarItems
  );

  const targetProduct: Fabric | null | undefined = useSelector<
    IApplicationState,
    Fabric | null | undefined
  >((state) => state.fabric.targetFabric);

  const fabrics: Fabric[] = useSelector<IApplicationState, Fabric[]>(
    (state) => state.fabric.fabrics
  );

  useEffect(() => {
    return () => {
      dispatch(fabricActions.changeTargetFabric(null));
    };
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

  const onCreate = (values: IFormValues) => {
    const payload = _buildNewPayload(values);

    dispatch(
      assignPendingActions(
        fabricActions.apiCreateFabric(payload),
        [],
        [],
        (args: any) => {
          dispatch(
            fabricActions.changeFabrics(
              new List(fabrics).concat([args.body]).toArray()
            )
          );
          dispatch(controlActions.closeRightPanel());
          dispatch(fabricActions.changeTargetFabric(null));
        },
        (args: any) => {}
      )
    );
  };

  const onEdit = (values: IFormValues, fabricForEdit: Fabric) => {
    const payload = _buildEditedPayload(values, fabricForEdit);

    dispatch(
      assignPendingActions(
        fabricActions.apiUpdateFabric(payload),
        [],
        [],
        (args: any) => {
          dispatch(
            fabricActions.changeFabrics(
              new List(fabrics)
                .select((fabric: Fabric) => {
                  let selectResult = fabric;

                  if (fabric.id === args.body.id) {
                    selectResult = args.body;
                  }

                  return selectResult;
                })
                .toArray()
            )
          );
          dispatch(controlActions.closeRightPanel());
          dispatch(fabricActions.changeTargetFabric(null));
        },
        (args: any) => {}
      )
    );
  };

  return (
    <Formik
      validationSchema={Yup.object().shape({
        fabricCode: Yup.string().required(() => 'Value is required'),
        description: Yup.string(),
        status: Yup.number(),
        composition: Yup.string().required(() => 'Composition is required'),
        pattern: Yup.string().required(() => 'Pattern is required'),
        metres: Yup.string().required(() => 'Metres is required'),
        weave: Yup.string().required(() => 'Weave is required'),
        color: Yup.string().required(() => 'Color is required'),
        mill: Yup.string().required(() => 'Mill is required'),
        gSM: Yup.string().required(() => 'GSM is required'),
        count: Yup.number(),
        imageFile: Yup.object().nullable(),
        fieldExternalImageURL: Yup.string().nullable(),
      })}
      initialValues={_initDefaultValues(targetProduct)}
      onSubmit={(values: any) => {
        if (targetProduct) onEdit(values, targetProduct);
        else onCreate(values);
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
          <Form>
            <Stack horizontal tokens={{ childrenGap: '12px' }}>
              <Stack.Item grow={1} styles={{ root: { width: '32%' } }}>
                <Stack>
                  <Entry
                    formik={formik}
                    fieldName={'fabricCode'}
                    label={'Fabric Code'}
                    isRequired
                  />

                  <Entry
                    formik={formik}
                    fieldName={'composition'}
                    label={'Composition'}
                    isRequired
                  />

                  <Entry
                    formik={formik}
                    fieldName={'pattern'}
                    label={'Pattern'}
                    isRequired
                  />

                  <Entry
                    formik={formik}
                    fieldName={'metres'}
                    label={'Metres'}
                    isRequired
                  />

                  <Entry
                    formik={formik}
                    fieldName={'weave'}
                    label={'Weave'}
                    isRequired
                  />

                  <Entry
                    formik={formik}
                    fieldName={'color'}
                    label={'Color'}
                    isRequired
                  />

                  <Entry
                    formik={formik}
                    fieldName={'mill'}
                    label={'Mill'}
                    isRequired
                  />

                  <Entry
                    formik={formik}
                    fieldName={'gSM'}
                    label={'GSM'}
                    isRequired
                  />
                </Stack>
              </Stack.Item>

              <Stack.Item grow={1} styles={{ root: { width: '32%' } }}>
                <Stack>
                  <Entry
                    formik={formik}
                    fieldName={'description'}
                    label={'Description'}
                    isRequired={false}
                  />

                  <FormDropdown
                    formik={formik}
                    fieldName={'status'}
                    label={'Status'}
                    options={_statuses}
                    resolveOnChangeValue={(
                      option: IDropdownOption | null | undefined
                    ) => {
                      return option
                        ? (option as any).status
                        : FabricStatuses.InStock;
                    }}
                    resolveSelectedKeyValue={(formValue: any) =>
                      formValue !== null && formValue !== undefined
                        ? `${formValue}`
                        : ''
                    }
                  />

                  <Entry
                    formik={formik}
                    fieldName={'count'}
                    label={'Count'}
                    isRequired={false}
                    isNumber
                  />
                </Stack>
              </Stack.Item>

              <Stack.Item grow={1} styles={{ root: { width: '32%' } }}>
                <Stack>
                  <div style={{ marginTop: '41px' }}>
                    <FormImageAttachemnt
                      formik={formik}
                      fieldName={'imageFile'}
                      fieldExternalImageURL={'fieldExternalImageURL'}
                    />
                  </div>
                </Stack>
              </Stack.Item>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FabricForm;
