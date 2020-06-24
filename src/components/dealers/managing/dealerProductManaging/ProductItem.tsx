import React, { useState } from 'react';
import {
  Stack,
  Text,
  Image,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  FontIcon,
  mergeStyles,
} from 'office-ui-fabric-react';
import './productItem.scss';
import { ProductCategory } from '../../../../interfaces/products';

export class ProductAssigningContext {
  private _rawSource: ProductCategory;

  constructor(product: ProductCategory) {
    this._rawSource = product;

    this.name = `${product.name}`;
    this.isDisabled = product.isDisabled;

    this.imageSourceUrl = product.imageUrl;
  }

  name: string;
  isDisabled: boolean;
  imageSourceUrl: string;

  isDirty: () => boolean = () => {
    let result = false;

    result = this.isDisabled !== this._rawSource.isDisabled;

    return result;
  };

  getSourceId: () => number = () => (this._rawSource ? this._rawSource.id : 0);
}

export class ProductItemProps {
  constructor() {
    this.context = new ProductAssigningContext(new ProductCategory());
    this.changedCallback = () => {};
  }

  context: ProductAssigningContext;
  changedCallback: (context: ProductAssigningContext) => void;
}

const ALLOW_HINT_COLOR: string = '#217346f0';
const DISMIS_HINT_COLOR: string = '#a4373af0';

export const ProductItem: React.FC<ProductItemProps> = (
  props: ProductItemProps
) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  if (isDisabled !== props.context.isDisabled)
    setIsDisabled(props.context.isDisabled);

  return (
    <div
      className={isDisabled === false ? 'productItem checked' : 'productItem'}
      onClick={() => {
        props.context.isDisabled = !isDisabled;
        props.context.isDirty();
        setIsDisabled(props.context.isDisabled);

        props.changedCallback(props.context);
      }}
    >
      <Stack>
        <Image
          src={props.context.imageSourceUrl}
          imageFit={0}
          styles={{ root: { height: '60px', width: '60px' } }}
        ></Image>
        <TooltipHost
          id={`unitValue_${props.context.getSourceId()}`}
          calloutProps={{ gapSpace: 0 }}
          delay={TooltipDelay.zero}
          directionalHint={DirectionalHint.bottomCenter}
          styles={{ root: { display: 'inline-block' } }}
          content={props.context.name}
        >
          <Text style={{ cursor: 'default', maxWidth: '60px' }} block nowrap>
            {props.context.name}
          </Text>
        </TooltipHost>
      </Stack>

      {props.context.isDirty() ? (
        <div className="styleUnitAssigningItem__actionIconHint">
          <TooltipHost
            id={`actionIconHintTooltip_${props.context.getSourceId()}`}
            calloutProps={{ gapSpace: 0 }}
            delay={TooltipDelay.zero}
            directionalHint={DirectionalHint.bottomCenter}
            styles={{ root: { display: 'inline-block' } }}
            content={props.context.isDisabled === false ? 'Allow' : 'Dismis'}
          >
            <FontIcon
              style={{ cursor: 'default', lineHeight: 1, background: 'white' }}
              iconName={
                props.context.isDisabled === false
                  ? 'PlugConnected'
                  : 'PlugDisconnected'
              }
              className={mergeStyles({
                fontSize: 16,
                color: props.context.isDisabled
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

export default ProductItem;
