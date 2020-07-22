import React from 'react';
import {
  FabricStatuses,
  FabricVisibilities,
  Fabric,
} from '../../../../interfaces/fabric';
import { Stack, IDropdownOption } from 'office-ui-fabric-react';
import Entry from '../../../../common/formFields/Entry';
import FormDropdown from '../../../../common/formFields/FormDropdown';
import FormImageAttachemnt from '../../../../common/formFields/FormImageAttachemnt';
import { isUserCanManageFabrics } from '../../../../helpers/fabric.helper';

const _buildStackStyle = (descriptionEntries: any[]) => {
  let styleResult: any = { root: { width: '48%' } };

  if (descriptionEntries.length === 0) {
    styleResult = { root: { width: 'auto' } };
  }

  return styleResult;
};

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
  fabricVisibilities: FabricVisibilities;
}

export const buildFabricVisibilities = (
  targetFabric: Fabric | null | undefined,
  fabrics: Fabric[]
) => {
  const result: FabricVisibilities = new FabricVisibilities();

  let resolvedFabric: Fabric | null | undefined = null;

  if (targetFabric) {
    resolvedFabric = targetFabric;
  } else {
    if (fabrics.length > 0) {
      resolvedFabric = fabrics[0];
    }
  }

  if (resolvedFabric) {
    result.isMetresVisible = resolvedFabric.isMetresVisible;
    result.isMillVisible = resolvedFabric.isMillVisible;
    result.isColorVisible = resolvedFabric.isColorVisible;
    result.isCompositionVisible = resolvedFabric.isCompositionVisible;
    result.isGSMVisible = resolvedFabric.isGSMVisible;
    result.isCountVisible = resolvedFabric.isCountVisible;
    result.isWeaveVisible = resolvedFabric.isWeaveVisible;
    result.isPatternVisible = resolvedFabric.isPatternVisible;
  }

  return result;
};

const FormLayout: React.FC<IFormLayoutProps> = (props: IFormLayoutProps) => {
  const canManageFabrics: boolean = isUserCanManageFabrics();

  const buildDescriptionEntries = () => {
    let entriesResult: any[] = [];

    if (props.fabricVisibilities.isMetresVisible) {
      entriesResult.push(
        <Entry
          formik={props.formik}
          fieldName={'metres'}
          label={'Metres'}
          isRequired
          readOnly={!canManageFabrics}
        />
      );
    }

    if (props.fabricVisibilities.isMillVisible) {
      entriesResult.push(
        <Entry
          formik={props.formik}
          fieldName={'mill'}
          label={'Mill'}
          isRequired
          readOnly={!canManageFabrics}
        />
      );
    }

    if (props.fabricVisibilities.isColorVisible) {
      entriesResult.push(
        <Entry
          formik={props.formik}
          fieldName={'color'}
          label={'Color'}
          isRequired
          readOnly={!canManageFabrics}
        />
      );
    }

    if (props.fabricVisibilities.isCompositionVisible) {
      entriesResult.push(
        <Entry
          formik={props.formik}
          fieldName={'composition'}
          label={'Composition'}
          isRequired
          readOnly={!canManageFabrics}
        />
      );
    }

    if (props.fabricVisibilities.isGSMVisible) {
      entriesResult.push(
        <Entry
          formik={props.formik}
          fieldName={'gSM'}
          label={'GSM'}
          isRequired
          readOnly={!canManageFabrics}
        />
      );
    }

    if (props.fabricVisibilities.isGSMVisible) {
      entriesResult.push(
        <Entry
          formik={props.formik}
          fieldName={'gSM'}
          label={'GSM'}
          isRequired
          readOnly={!canManageFabrics}
        />
      );
    }

    if (props.fabricVisibilities.isCountVisible) {
      entriesResult.push(
        <Entry
          readOnly={!canManageFabrics}
          formik={props.formik}
          fieldName={'count'}
          label={'Count'}
          isRequired={false}
          isNumber
        />
      );
    }

    if (props.fabricVisibilities.isWeaveVisible) {
      entriesResult.push(
        <Entry
          formik={props.formik}
          fieldName={'weave'}
          label={'Weave'}
          isRequired
          readOnly={!canManageFabrics}
        />
      );
    }

    if (props.fabricVisibilities.isPatternVisible) {
      entriesResult.push(
        <Entry
          formik={props.formik}
          fieldName={'pattern'}
          label={'Pattern'}
          isRequired
          readOnly={!canManageFabrics}
        />
      );
    }

    return entriesResult;
  };

  const descriptionEntries: any[] = buildDescriptionEntries();

  return (
    <Stack horizontal tokens={{ childrenGap: '12px' }}>
      <Stack.Item grow={1} styles={_buildStackStyle(descriptionEntries)}>
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

          <div style={{ marginTop: '21px' }}>
            <FormImageAttachemnt
              readOnly={!canManageFabrics}
              formik={props.formik}
              fieldName={'imageFile'}
              fieldExternalImageURL={'fieldExternalImageURL'}
            />
          </div>
        </Stack>
      </Stack.Item>

      {descriptionEntries.length > 0 ? (
        <Stack.Item grow={1} styles={_buildStackStyle(descriptionEntries)}>
          <Stack>
            {descriptionEntries.map((item: any, index: number) => {
              return <div key={index}>{item}</div>;
            })}
          </Stack>
        </Stack.Item>
      ) : null}
    </Stack>
  );
};

export default FormLayout;
