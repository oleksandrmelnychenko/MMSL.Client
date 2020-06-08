import React, { useState } from 'react';
import { OptionUnit } from '../../../../../interfaces';
import {
  Stack,
  Checkbox,
  Text,
  Image,
  IImageProps,
  ImageFit,
  Separator,
  IFontStyles,
  ITextProps,
} from 'office-ui-fabric-react';

export class UnitAssigningContext {
  private _rawSource: OptionUnit;

  constructor(optionUnit: OptionUnit) {
    this._rawSource = optionUnit;

    this.value = `${optionUnit.value}`;
    this.checked = optionUnit.isAllow;

    this.imageSourceUrl = optionUnit.imageUrl;
  }

  value: string;
  checked: boolean;
  imageSourceUrl: string;

  isDirty: () => boolean = () => {
    let result = false;

    result = this.checked !== this._rawSource.isAllow;

    return result;
  };

  getSourceUnitId: () => number = () =>
    this._rawSource ? this._rawSource.id : 0;

  getSourceGroupId: () => number = () =>
    this._rawSource?.optionGroupId ? this._rawSource.optionGroupId : 0;
}

export class StyleUnitAssigningItemProps {
  constructor() {
    this.context = new UnitAssigningContext(new OptionUnit());
    this.changedCallback = () => {};
  }

  context: UnitAssigningContext;
  changedCallback: () => void;
}

const ALLOW_HINT_COLOR: string = '#217346f0';
const DISALLOW_HINT_COLOR: string = '#a4373af0';

export const StyleUnitAssigningItem: React.FC<StyleUnitAssigningItemProps> = (
  props: StyleUnitAssigningItemProps
) => {
  const [checked, setChecked] = useState<boolean>(false);

  if (checked !== props.context.checked) setChecked(props.context.checked);

  return (
    <div className="styleUnitAssigningItem">
      <Stack horizontal tokens={{ childrenGap: 6 }}>
        <Checkbox
          styles={
            {
              // root: { width: '16px', height: '16px' },
              // checkbox: { borderColor: '#797775' },
              // checkmark: { fontSize: '10px' },
            }
          }
          onChange={(ev?: any, checked?: boolean) => {
            props.context.checked =
              checked !== null && checked !== undefined ? checked : false;
            props.context.isDirty();
            setChecked(props.context.checked);

            props.changedCallback();
          }}
          checked={checked}
          label={props.context.value}
        />

        {props.context.isDirty() ? (
          <Separator
            styles={{ content: { padding: '6px 0 6px 0' } }}
            vertical
          />
        ) : null}

        {props.context.isDirty() ? (
          <Text
            variant={'smallPlus' as ITextProps['variant']}
            styles={{
              root: {
                color: props.context.checked
                  ? ALLOW_HINT_COLOR
                  : DISALLOW_HINT_COLOR,
              },
            }}
          >
            {props.context.checked ? 'Allow' : 'Disallow'}
          </Text>
        ) : null}
      </Stack>
    </div>
  );
};

export default StyleUnitAssigningItem;
