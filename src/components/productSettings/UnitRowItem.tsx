import React, { useEffect, useState } from 'react';
import './productSettingsLsit.scss';
import {
  DetailsList,
  IColumn,
  Text,
  Selection,
  Image,
  Stack,
  IconButton,
  CheckboxVisibility,
  GroupHeader,
  ITextProps,
  IImageProps,
  ImageFit,
  FontIcon,
  ScrollablePane,
  DetailsRow,
  mergeStyles,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { OptionGroup, OptionUnit } from '../../interfaces';
import { assignPendingActions } from '../../helpers/action.helper';
import * as productSettingsActions from '../../redux/actions/productSettings.actions';
import { ManagingPanelComponent } from '../../redux/reducers/productSettings.reducer';
import { List } from 'linq-typescript';
import { scrollablePaneStyleForDetailList } from '../../common/fabric-styles/styles';
import { DATA_SELECTION_DISABLED_CLASS } from '../dealers/DealerList';
import * as controlAction from '../../redux/actions/control.actions';
import {
  DialogArgs,
  CommonDialogType,
} from '../../redux/reducers/control.reducer';
import { useId } from '@uifabric/react-hooks';

export class UnitRowItemProps {
  constructor() {
    this.optionUnit = new OptionUnit();
  }

  optionUnit: OptionUnit;
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

  return (
    <Stack horizontal tokens={{ childrenGap: 20 }}>
      {props.optionUnit.imageUrl && props.optionUnit.imageUrl.length > 0 ? (
        <Stack.Item>
          <Image {...imageProps} alt={`${props.optionUnit.value}`} />
        </Stack.Item>
      ) : null}

      <Stack>
        <Stack.Item>
          <Text
            variant={'mediumPlus' as ITextProps['variant']}
            styles={{ root: { color: '#484848', fontWeight: 400 } }}
          >
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
              content={props.optionUnit.isMandatory ? 'Allowed' : 'Not allowed'}
            >
              <FontIcon
                iconName="Unlock"
                className={mergeStyles({ fontSize: 16, color: allowColor })}
              />
            </TooltipHost>
          </Stack>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

export default UnitRowItem;
