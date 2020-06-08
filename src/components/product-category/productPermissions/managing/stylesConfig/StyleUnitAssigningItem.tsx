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
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  FontIcon,
  mergeStyles,
} from 'office-ui-fabric-react';
import './styleUnitAssigningItem.scss';

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
const DISMIS_HINT_COLOR: string = '#a4373af0';

export const StyleUnitAssigningItem: React.FC<StyleUnitAssigningItemProps> = (
  props: StyleUnitAssigningItemProps
) => {
  const [checked, setChecked] = useState<boolean>(false);

  if (checked !== props.context.checked) setChecked(props.context.checked);

  return (
    <div
      className={
        checked ? 'styleUnitAssigningItem checked' : 'styleUnitAssigningItem'
      }
      onClick={() => {
        props.context.checked = !checked;
        props.context.isDirty();
        setChecked(props.context.checked);

        props.changedCallback();
      }}
    >
      <Stack>
        <Image
          src={props.context.imageSourceUrl}
          imageFit={0}
          styles={{ root: { height: '60px', width: '60px' } }}
        ></Image>
        <TooltipHost
          id={`unitValue_${props.context.getSourceUnitId()}`}
          calloutProps={{ gapSpace: 0 }}
          delay={TooltipDelay.zero}
          directionalHint={DirectionalHint.bottomCenter}
          styles={{ root: { display: 'inline-block' } }}
          content={props.context.value}
        >
          <Text style={{ cursor: 'default', maxWidth: '60px' }} block nowrap>
            {props.context.value}
          </Text>
        </TooltipHost>
      </Stack>

      {props.context.isDirty() ? (
        <div className="styleUnitAssigningItem__actionIconHint">
          <TooltipHost
            id={`actionIconHintTooltip_${props.context.getSourceUnitId()}`}
            calloutProps={{ gapSpace: 0 }}
            delay={TooltipDelay.zero}
            directionalHint={DirectionalHint.bottomCenter}
            styles={{ root: { display: 'inline-block' } }}
            content={props.context.checked ? 'Allow' : 'Dismis'}
          >
            <FontIcon
              style={{ cursor: 'default', lineHeight: 1, background: 'white' }}
              iconName={
                props.context.checked ? 'PlugConnected' : 'PlugDisconnected'
              }
              className={mergeStyles({
                fontSize: 16,
                color: props.context.checked
                  ? ALLOW_HINT_COLOR
                  : DISMIS_HINT_COLOR,
              })}
            />
          </TooltipHost>
        </div>
      ) : null}
    </div>
  );
};

export default StyleUnitAssigningItem;
