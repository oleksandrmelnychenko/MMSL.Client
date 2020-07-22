import React from 'react';
import { FabricStatuses } from '../../../interfaces/fabric';
import { Stack, IDropdownOption } from 'office-ui-fabric-react';
import Entry from '../../../common/formFields/Entry';
import FormDropdown from '../../../common/formFields/FormDropdown';
import FormImageAttachemnt from '../../../common/formFields/FormImageAttachemnt';
import { isUserCanManageFabrics } from '../../../helpers/fabric.helper';

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

export interface IFormLayoutProps {
  formik: any;
}

const FormLayout: React.FC<IFormLayoutProps> = (props: IFormLayoutProps) => {
  const canManageFabrics: boolean = isUserCanManageFabrics();

  return (
    <Stack horizontal tokens={{ childrenGap: '12px' }}>
      <Stack.Item grow={1} styles={{ root: { width: '32%' } }}>
        <Stack>
          <Entry
            formik={props.formik}
            fieldName={'fabricCode'}
            label={'Fabric Code'}
            isRequired
            readOnly={!canManageFabrics}
          />

          <Entry
            formik={props.formik}
            fieldName={'composition'}
            label={'Composition'}
            isRequired
            readOnly={!canManageFabrics}
          />

          <Entry
            formik={props.formik}
            fieldName={'pattern'}
            label={'Pattern'}
            isRequired
            readOnly={!canManageFabrics}
          />

          <Entry
            formik={props.formik}
            fieldName={'metres'}
            label={'Metres'}
            isRequired
            readOnly={!canManageFabrics}
          />

          <Entry
            formik={props.formik}
            fieldName={'weave'}
            label={'Weave'}
            isRequired
            readOnly={!canManageFabrics}
          />

          <Entry
            formik={props.formik}
            fieldName={'color'}
            label={'Color'}
            isRequired
            readOnly={!canManageFabrics}
          />

          <Entry
            formik={props.formik}
            fieldName={'mill'}
            label={'Mill'}
            isRequired
            readOnly={!canManageFabrics}
          />

          <Entry
            formik={props.formik}
            fieldName={'gSM'}
            label={'GSM'}
            isRequired
            readOnly={!canManageFabrics}
          />
        </Stack>
      </Stack.Item>

      <Stack.Item grow={1} styles={{ root: { width: '32%' } }}>
        <Stack>
          <Entry
            formik={props.formik}
            fieldName={'description'}
            label={'Description'}
            isRequired={false}
            readOnly={!canManageFabrics}
          />

          <FormDropdown
            readOnly={!canManageFabrics}
            formik={props.formik}
            fieldName={'status'}
            label={'Status'}
            options={_statuses}
            resolveOnChangeValue={(
              option: IDropdownOption | null | undefined
            ) => {
              return option ? (option as any).status : FabricStatuses.InStock;
            }}
            resolveSelectedKeyValue={(formValue: any) =>
              formValue !== null && formValue !== undefined
                ? `${formValue}`
                : ''
            }
          />

          <Entry
            readOnly={!canManageFabrics}
            formik={props.formik}
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
              readOnly={!canManageFabrics}
              formik={props.formik}
              fieldName={'imageFile'}
              fieldExternalImageURL={'fieldExternalImageURL'}
            />
          </div>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

export default FormLayout;
