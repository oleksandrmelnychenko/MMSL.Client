import React from 'react';
import { Fabric, FabricStatuses } from '../../../interfaces/fabric';
import {
  Stack,
  Text,
  FontIcon,
  mergeStyles,
  TooltipHost,
  DirectionalHint,
} from 'office-ui-fabric-react';
import './fabricItem.scss';
import ItemManagingControls from './ItemManagingControls';
import './fabricItem.scss';

const IN_STOCK_COLOR: string = '#107c10';
const OUT_OF_STOCK_COLOR: string = '#da3b01';
const DISCONTINUED_COLOR: string = '#979593';

const IN_STOCK_HINT: string = 'In stock';
const OUT_OF_STOCK_HINT: string = 'Out of stock';
const DISCONTINUED_HINT: string = 'Discontinued';

const _fabricStatusToColor = (status: FabricStatuses) => {
  let colorResult: string = '#00000000';

  if (status === FabricStatuses.InStock) colorResult = IN_STOCK_COLOR;
  else if (status === FabricStatuses.OutOfStock)
    colorResult = OUT_OF_STOCK_COLOR;
  else if (status === FabricStatuses.Discontinued)
    colorResult = DISCONTINUED_COLOR;

  return colorResult;
};

const _fabricStatusToHint = (status: FabricStatuses) => {
  let colorResult: string = 'Unknown status';

  if (status === FabricStatuses.InStock) colorResult = IN_STOCK_HINT;
  else if (status === FabricStatuses.OutOfStock)
    colorResult = OUT_OF_STOCK_HINT;
  else if (status === FabricStatuses.Discontinued)
    colorResult = DISCONTINUED_HINT;

  return colorResult;
};

export interface IItemInfoProps {
  fabric: Fabric;
}

const ItemInfo: React.FC<IItemInfoProps> = (props: IItemInfoProps) => {
  return (
    <div className={'fabricItem__info'}>
      <Stack>
        <Stack horizontal style={{ paddingBottom: '12px' }}>
          <Stack tokens={{ childrenGap: '6px' }}>
            <Text
              variant="large"
              block
              nowrap
              styles={{
                root: {
                  color: '#505050',
                  fontWeight: 400,
                  zIndex: 2,
                  cursor: 'auto',
                  width: '200px',
                },
              }}
            >
              {props.fabric.fabricCode}
            </Text>
            <Text
              variant="large"
              block
              nowrap
              styles={{
                root: {
                  color: '#505050',
                  fontWeight: 400,
                  zIndex: 2,
                  cursor: 'auto',
                  width: '200px',
                },
              }}
            >
              {props.fabric.description}
            </Text>
          </Stack>

          <Stack.Item>
            <TooltipHost
              content={_fabricStatusToHint(props.fabric.status)}
              directionalHint={DirectionalHint.bottomRightEdge}
              id="statusIndicator"
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <FontIcon
                style={{
                  cursor: 'default',
                  lineHeight: 1,
                }}
                iconName="RadioBullet"
                className={mergeStyles({
                  fontSize: 30,
                  color: _fabricStatusToColor(props.fabric.status),
                })}
              />
            </TooltipHost>
          </Stack.Item>
        </Stack>

        <ItemManagingControls fabric={props.fabric} />
      </Stack>
    </div>
  );
};

export default ItemInfo;
