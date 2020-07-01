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
import { StoreCustomer } from '../../../../interfaces/storeCustomer';
import { List } from 'linq-typescript';
import { ProductCategory } from '../../../../interfaces/products';
import './orderProfileDetails.scss';
import { CustomerProductProfile } from '../../../../interfaces/orderProfile';

export interface IOrderProfileDetailsProps {
  customers: StoreCustomer[];
  products: ProductCategory[];
  formik: any;
  isEditingOrderProfile: boolean;
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

const _renderCustomerInfo = (customers: StoreCustomer[], formik: any) => {
  let result = null;

  if (formik.values.customer) {
    const selectedCustomer = new List<StoreCustomer>(customers).firstOrDefault(
      (customer) => customer.id === formik.values.customer.id
    );

    if (selectedCustomer) {
      const partialContents: any[] = [];

      partialContents.push(
        _onRenderPartialDetail('Name', selectedCustomer.userName)
      );
      partialContents.push(
        _onRenderPartialDetail('Email', selectedCustomer.email)
      );
      partialContents.push(
        _onRenderPartialDetail('Store', selectedCustomer.store?.name)
      );
      partialContents.push(
        _onRenderPartialDetail('Phone Number', selectedCustomer.phoneNumber)
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
  } else {
    result = _renderHintLable(
      'Select and explore customer for current order profile.'
    );
  }

  return result;
};

const _renderProductInfo = (
  products: ProductCategory[],
  formik: any,
  isEditingOrderProfile: boolean
) => {
  let result = null;

  if (formik.values.productCategory) {
    const selectedProduct = new List<ProductCategory>(products).firstOrDefault(
      (product) => product.id === formik.values.productCategory.id
    );

    if (selectedProduct) {
      const partialContents: any[] = [];

      if (isEditingOrderProfile)
        partialContents.push(
          _onRenderPartialDetail('Name', selectedProduct.name)
        );

      partialContents.push(
        _onRenderPartialDetail('Description', selectedProduct.description)
      );

      if (selectedProduct.imageUrl && selectedProduct.imageUrl.length > 0) {
        const imageProps: IImageProps = {
          src: selectedProduct.imageUrl,
          imageFit: ImageFit.centerContain,
          width: 'inherit',
          height: '260px',
        };
        partialContents.push(
          <div className={'orderProfileDetails__productImage'}>
            <Image {...imageProps} alt={`${selectedProduct.name}`} />
          </div>
        );
      } else {
        partialContents.push(
          <Stack
            horizontalAlign="center"
            className={'orderProfileDetails__productImage'}
          >
            <Text
              block
              styles={{ root: { color: '#a19f9d', fontSize: '12px' } }}
            >
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
  } else {
    result = _renderHintLable(
      'Select and explore cusproduct for current order profile.'
    );
  }

  return result;
};

export const OrderProfileDetails: React.FC<IOrderProfileDetailsProps> = (
  props: IOrderProfileDetailsProps
) => {
  return (
    <div className={'orderProfileDetails'}>
      <Stack tokens={{ childrenGap: '18px' }}>
        <Stack tokens={{ childrenGap: '6px' }}>
          <Separator alignContent="start">Customer</Separator>
          {_renderCustomerInfo(props.customers, props.formik)}
        </Stack>
        <Stack tokens={{ childrenGap: '6px' }}>
          <Separator alignContent="start">Product</Separator>
          {_renderProductInfo(
            props.products,
            props.formik,
            props.isEditingOrderProfile
          )}
        </Stack>
      </Stack>
    </div>
  );
};

export default OrderProfileDetails;
