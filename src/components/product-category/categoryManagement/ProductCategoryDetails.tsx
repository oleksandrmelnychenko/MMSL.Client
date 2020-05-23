import React from 'react';
import Stack from 'office-ui-fabric-react/lib/components/Stack/Stack';
import {
  FocusZone,
  FocusZoneDirection,
  Separator,
} from 'office-ui-fabric-react';

class ProductCategoryDetailsProps {}

export const ProductCategoryDetails: React.FC<ProductCategoryDetailsProps> = (
  props: ProductCategoryDetailsProps
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
              <Separator alignContent="start">Assigned groups</Separator>
              {'TODO: list of assigned groups'}
            </div>
          </FocusZone>
        </Stack.Item>

        <Stack.Item grow={1} styles={{ root: { maxWidth: '49%' } }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Option Groups</Separator>
              {'TODO: list of all groups'}
            </div>
          </FocusZone>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default ProductCategoryDetails;
