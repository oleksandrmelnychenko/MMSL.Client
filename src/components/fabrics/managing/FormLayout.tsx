import React from 'react';
import { FabricStatuses } from '../../../interfaces/fabric';
import { Stack, IDropdownOption } from 'office-ui-fabric-react';
import Entry from '../../../common/formFields/Entry';
import FormDropdown from '../../../common/formFields/FormDropdown';
import FormImageAttachemnt from '../../../common/formFields/FormImageAttachemnt';

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
  return (
    <Stack horizontal tokens={{ childrenGap: '12px' }}>
      <Stack.Item grow={1} styles={{ root: { width: '32%' } }}>
        <Stack>
          <Entry
            formik={props.formik}
            fieldName={'fabricCode'}
            label={'Fabric Code'}
            isRequired
          />

          <Entry
            formik={props.formik}
            fieldName={'composition'}
            label={'Composition'}
            isRequired
          />

          <Entry
            formik={props.formik}
            fieldName={'pattern'}
            label={'Pattern'}
            isRequired
          />

          <Entry
            formik={props.formik}
            fieldName={'metres'}
            label={'Metres'}
            isRequired
          />

          <Entry
            formik={props.formik}
            fieldName={'weave'}
            label={'Weave'}
            isRequired
          />

          <Entry
            formik={props.formik}
            fieldName={'color'}
            label={'Color'}
            isRequired
          />

          <Entry
            formik={props.formik}
            fieldName={'mill'}
            label={'Mill'}
            isRequired
          />

          <Entry
            formik={props.formik}
            fieldName={'gSM'}
            label={'GSM'}
            isRequired
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
          />

          <FormDropdown
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
