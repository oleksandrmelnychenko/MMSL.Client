import React, { useState } from 'react';
import { OptionUnit } from '../../../../../interfaces';
import {
  Stack,
  Checkbox,
  Text,
  Image,
  IImageProps,
  ImageFit,
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
}

export class StyleUnitAssigningItemProps {
  constructor() {
    this.context = new UnitAssigningContext(new OptionUnit());
    this.changedCallback = () => {};
  }

  context: UnitAssigningContext;
  changedCallback: () => void;
}

export const StyleUnitAssigningItem: React.FC<StyleUnitAssigningItemProps> = (
  props: StyleUnitAssigningItemProps
) => {
  const [checked, setChecked] = useState<boolean>(false);

  if (checked !== props.context.checked) setChecked(props.context.checked);

  // const imageProps: IImageProps = {
  //   src: props.context.imageSourceUrl,
  //   imageFit: ImageFit.center,
  //   width: 67,
  //   height: 53,
  // };

  return (
    <div className="styleUnitAssigningItem">
      <Stack horizontal tokens={{ childrenGap: 6 }}>
        <Checkbox
          onChange={(ev?: any, checked?: boolean) => {
            props.context.checked =
              checked !== null && checked !== undefined ? checked : false;
            props.context.isDirty();
            setChecked(props.context.checked);

            props.changedCallback();
          }}
          checked={checked}
        />
        <Stack tokens={{ childrenGap: 6 }}>
          <Text>{props.context.value}</Text>
          {/* {props.context.imageSourceUrl &&
          props.context.imageSourceUrl.length > 0 ? (
            <Stack.Item>
              <Image {...imageProps} alt={`${props.context.value}`} />
            </Stack.Item>
          ) : null} */}
        </Stack>
      </Stack>
    </div>
  );
};

export default StyleUnitAssigningItem;
