import React from 'react';
import {
  Stack,
  FocusZoneDirection,
  FocusZone,
  Separator,
} from 'office-ui-fabric-react';
import { ProductCategoryFormProps } from './ProductCategoryForm';

class ProductManagementDetailsProps extends ProductCategoryFormProps {}

export const ProductManagementDetails: React.FC<ProductManagementDetailsProps> = (
  props: ProductManagementDetailsProps
) => {
  return (
    <div>
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}
      >
        <Stack.Item grow={1} styles={{ root: { maxWidth: '49%' } }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Options</Separator>
            </div>
          </FocusZone>
        </Stack.Item>
        <Stack.Item grow={1}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'list'} data-is-scrollable={true}>
              <Separator alignContent="start">{`Details: `}</Separator>
            </div>
          </FocusZone>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default ProductManagementDetails;
