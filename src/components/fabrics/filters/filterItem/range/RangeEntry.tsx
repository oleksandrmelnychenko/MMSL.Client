import React from 'react';
import { FilterItem } from '../../../../../interfaces/fabric';
import { Stack, Label, TextField } from 'office-ui-fabric-react';
import * as fabricStyles from '../../../../../common/fabric-styles/styles';

export interface IRangeEntryProps {
  filterItem: FilterItem;
  value: number;
  isMin: boolean;
  onValueChanged: (value: number) => void;
}

const RangeEntry: React.FC<IRangeEntryProps> = (props: IRangeEntryProps) => {
  return (
    <Stack horizontal tokens={{ childrenGap: '6px' }}>
      <Label
        styles={{
          root: {
            fontWeight: 400,
            fontSize: '12px',
            color: '#a19f9d',
            marginTop: '2px',
          },
        }}
      >
        {props.isMin ? 'Ftom' : 'To'}
      </Label>
      <TextField
        type={'number'}
        step="0.01"
        value={`${props.value}`}
        autoComplete={'off'}
        style={{ width: '70px' }}
        styles={fabricStyles.textFildLabelStyles}
        className="form__group__field"
        onChange={(args: any) => {
          let value = args?.target?.value;

          let parsedValue = parseFloat(value);

          if (isNaN(parsedValue)) parsedValue = 0;

          props.onValueChanged(parsedValue);
        }}
      />
    </Stack>
  );
};

export default RangeEntry;
