import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../../redux/reducers';
import { OptionGroup } from '../../../../interfaces/options';
import { ProductCategory } from '../../../../interfaces/products';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { productSettingsActions } from '../../../../redux/slices/productSettings.slice';
import { List } from 'office-ui-fabric-react/lib/List';
import StyleGroupItem from './StyleGroupItem';

export const StylesList: React.FC = () => {
  const dispatch = useDispatch();

  const targetProduct: ProductCategory | null = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const outionGroups: OptionGroup[] = useSelector<
    IApplicationState,
    OptionGroup[]
  >((state) => state.productSettings.optionGroupsList);

  useEffect(() => {
    if (targetProduct?.id) getProductStyles(targetProduct.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const getProductStyles: (productId: number) => void = (productId: number) => {
    dispatch(
      assignPendingActions(
        productSettingsActions.apiGetAllOptionGroupsByProductIdList(productId),
        [],
        [],
        (args: any) => {
          dispatch(productSettingsActions.updateOptionGroupList(args));
        },
        (args: any) => {}
      )
    );
  };

  const onRenderCell = (item: any, index: number | undefined): JSX.Element => {
    return (
      <div style={{ marginBottom: '18px' }}>
        <StyleGroupItem styleGroup={item} />
      </div>
    );
  };

  return (
    <div
      className="wrapper-list"
      style={{ paddingBottom: '0px', paddingTop: '0px' }}
    >
      <List items={outionGroups} onRenderCell={onRenderCell} />
    </div>
  );
};

export default StylesList;
