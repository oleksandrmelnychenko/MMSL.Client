import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productSettingsActions } from '../../../../redux/slices/productSettings.slice';
import OptionItemsOrderingList from './OptionItemsOrderingList';
import ManagingProductUnitForm from './ManagingProductUnitForm';
import { Stack, Separator } from 'office-ui-fabric-react';
import { OptionUnit } from '../../../../interfaces/options';
import { ProductCategory } from '../../../../interfaces/products';
import { IApplicationState } from '../../../../redux/reducers';
import { assignPendingActions } from '../../../../helpers/action.helper';

const _columnStyle = { root: { maxWidth: '49%', minWidth: '49%' } };

export const OptionGroupDetails: React.FC = () => {
  const dispatch = useDispatch();

  const targetProduct: ProductCategory | null = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  useEffect(() => {
    if (targetProduct?.id) {
      dispatch(
        assignPendingActions(
          productSettingsActions.apiGetAllOptionGroupsByProductIdList(
            targetProduct.id
          ),
          [],
          [],
          (args: any) => {
            dispatch(productSettingsActions.updateOptionGroupList(args));
          },
          (args: any) => {}
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectedOptionUnit: OptionUnit | null = useSelector<
    IApplicationState,
    OptionUnit | null
  >(
    (state) => state.productSettings.managingOptionUnitsState.selectedOptionUnit
  );

  return (
    <div>
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}
      >
        <Stack.Item grow={1} styles={_columnStyle}>
          <div className={'dealer__stores'} data-is-scrollable={true}>
            <Separator alignContent="start">Option units</Separator>
            <OptionItemsOrderingList />
          </div>
        </Stack.Item>

        <Stack.Item grow={1} styles={_columnStyle}>
          <div className={'list'} data-is-scrollable={true}>
            <Separator alignContent="start">
              {`Details: ${sectedOptionUnit ? sectedOptionUnit.value : ''}`}
            </Separator>
            <ManagingProductUnitForm />
          </div>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default OptionGroupDetails;
