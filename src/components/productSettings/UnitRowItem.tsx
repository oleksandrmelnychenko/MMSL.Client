import React from 'react';
import './productSettingsLsit.scss';
import {
  Text,
  Image,
  Stack,
  ITextProps,
  IImageProps,
  ImageFit,
  FontIcon,
  mergeStyles,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import { OptionUnit } from '../../interfaces';
import { useId } from '@uifabric/react-hooks';

export class UnitRowItemProps {
  constructor() {
    this.optionUnit = new OptionUnit();
    this.takeMarginWhenNoImage = false;
  }

  optionUnit: OptionUnit;
  takeMarginWhenNoImage?: boolean;
}

export const UnitRowItem: React.FC<UnitRowItemProps> = (
  props: UnitRowItemProps
) => {
  const imageProps: IImageProps = {
    src: props.optionUnit.imageUrl,
    imageFit: ImageFit.center,
    width: 67,
    height: 53,
  };

  const allowTooltipId = useId(`allowTooltip_${props.optionUnit.id}`);

  let allowColor = props.optionUnit.isMandatory ? '#2b579a' : '#2b579a60';

  let infoStyle: any = {};

  if (props.takeMarginWhenNoImage === true) {
    if (props.optionUnit.imageUrl) {
      if (props.optionUnit.imageUrl.length < 1) {
        infoStyle = { root: { position: 'relative', left: '88px' } };
      }
    } else {
      infoStyle = { root: { position: 'relative', left: '88px' } };
    }
  }

  return (
    <Stack horizontal tokens={{ childrenGap: 20 }}>
      {props.optionUnit.imageUrl && props.optionUnit.imageUrl.length > 0 ? (
        <Stack.Item>
          <Image {...imageProps} alt={`${props.optionUnit.value}`} />
        </Stack.Item>
      ) : null}

      <Stack styles={infoStyle}>
        <Stack.Item>
          <Text
            variant={'mediumPlus' as ITextProps['variant']}
            styles={{ root: { color: '#484848', fontWeight: 400 } }}>
            {props.optionUnit.value}
          </Text>
        </Stack.Item>
        <Stack.Item>
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <TooltipHost
              id={allowTooltipId}
              calloutProps={{ gapSpace: 0 }}
              delay={TooltipDelay.zero}
              directionalHint={DirectionalHint.bottomCenter}
              styles={{ root: { display: 'inline-block' } }}
              content={
                props.optionUnit.isMandatory ? 'Allowed' : 'Not allowed'
              }>
              <FontIcon
                iconName="Unlock"
                className={mergeStyles({
                  fontSize: 16,
                  color: allowColor,
                  cursor: 'default',
                })}
              />
            </TooltipHost>
          </Stack>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

export default UnitRowItem;
