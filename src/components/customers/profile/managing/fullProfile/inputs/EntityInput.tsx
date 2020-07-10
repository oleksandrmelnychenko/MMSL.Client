import React from 'react';
import { Stack } from 'office-ui-fabric-react';
import Entry from '../../../../../../common/formFields/Entry';

export interface IEntityInputProps {
  formik: any;
}

export const EntityInput: React.FC<IEntityInputProps> = (
  props: IEntityInputProps
) => {
  return (
    <Stack styles={{ root: { marginBottom: '6px' } }}>
      <Entry isRequired formik={props.formik} fieldName="name" label="Name" />
    </Stack>
  );
};

export default EntityInput;
