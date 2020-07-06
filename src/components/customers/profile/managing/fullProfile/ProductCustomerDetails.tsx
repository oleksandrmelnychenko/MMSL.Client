import React from 'react';
import {
  Text,
  Stack,
  Image,
  Separator,
  Label,
  IImageProps,
  ImageFit,
  FontIcon,
  mergeStyles,
} from 'office-ui-fabric-react';
import { ProductCategory } from '../../../../../interfaces/products';
import './productCustomerDetails.scss';
import { StoreCustomer } from '../../../../../interfaces/storeCustomer';

export interface IProductCustomerDetailsProps {
  customer: StoreCustomer;
  product: ProductCategory;
}

const _renderHintLable = (textMessage: string): JSX.Element => {
  const result = (
    <Label
      styles={{
        root: {
          fontWeight: 400,
          fontSize: '12px',
          color: '#a19f9d',
        },
      }}
    >
      {textMessage}
    </Label>
  );

  return result;
};

const _onRenderPartialDetail = (
  title: string,
  content: string | null | undefined
) => {
  let result = null;

  if (content && content.length > 0) {
    result = (
      <Stack horizontal tokens={{ childrenGap: 6 }}>
        <Text
          block
          styles={{
            root: { fontSize: '12px', color: '#a19f9d', marginTop: '2px' },
          }}
        >{`${title}:`}</Text>
        <Text
          block
          styles={{ root: { fontSize: '14px', color: 'rgb(50, 49, 48)' } }}
        >
          {content}
        </Text>
      </Stack>
    );
  }

  return result;
};

const _renderCustomerInfo = (customer: StoreCustomer) => {
  let result = null;

  if (customer) {
    const partialContents: any[] = [];

    partialContents.push(_onRenderPartialDetail('Name', customer.customerName));
    partialContents.push(_onRenderPartialDetail('Email', customer.email));
    partialContents.push(_onRenderPartialDetail('Store', customer.store?.name));
    partialContents.push(
      _onRenderPartialDetail('Phone Number', customer.phoneNumber)
    );

    if (partialContents.length > 0) {
      result = (
        <Stack tokens={{ childrenGap: 3 }}>
          {partialContents.map((partialContent, index) => (
            <Stack.Item key={index}>{partialContent}</Stack.Item>
          ))}
        </Stack>
      );
    }
  }

  return result;
};

const _renderProductInfo = (product: ProductCategory) => {
  let result = null;

  if (product) {
    const partialContents: any[] = [];

    partialContents.push(_onRenderPartialDetail('Name', product.name));

    partialContents.push(
      _onRenderPartialDetail('Description', product.description)
    );

    if (product.imageUrl && product.imageUrl.length > 0) {
      const imageProps: IImageProps = {
        src: product.imageUrl,
        imageFit: ImageFit.centerContain,
        width: 'inherit',
        height: '260px',
      };
      partialContents.push(
        <div className={'productCustomerDetails__productImage'}>
          <Image {...imageProps} alt={`${product.name}`} />
        </div>
      );
    } else {
      partialContents.push(
        <Stack
          horizontalAlign="center"
          className={'productCustomerDetails__productImage'}
        >
          <Text block styles={{ root: { color: '#a19f9d', fontSize: '12px' } }}>
            {'Attachment is missing'}
          </Text>
          {_renderHintLable}
          <FontIcon
            iconName="ImagePixel"
            className={mergeStyles({
              fontSize: 24,
              width: 24,
              color: '#cfcfcf',
            })}
          />
        </Stack>
      );
    }

    if (partialContents.length > 0) {
      result = (
        <Stack tokens={{ childrenGap: 3 }}>
          {partialContents.map((partialContent, index) => (
            <Stack.Item key={index}>{partialContent}</Stack.Item>
          ))}
        </Stack>
      );
    }
  }

  return result;
};

export const ProductCustomerDetails: React.FC<IProductCustomerDetailsProps> = (
  props: IProductCustomerDetailsProps
) => {
  return (
    <div className={'productCustomerDetails'}>
      <Stack tokens={{ childrenGap: '18px' }}>
        <Stack tokens={{ childrenGap: '6px' }}>
          <Separator alignContent="start">Customer</Separator>
          {_renderCustomerInfo(props.customer)}
        </Stack>
        <Stack tokens={{ childrenGap: '6px' }}>
          <Separator alignContent="start">Product</Separator>
          {_renderProductInfo(props.product)}
        </Stack>
      </Stack>
    </div>
  );
};

export default ProductCustomerDetails;
