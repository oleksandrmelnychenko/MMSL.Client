import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../../redux/reducers';
import { OptionGroup } from '../../../../interfaces/options';
import { ProductCategory } from '../../../../interfaces/products';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { productSettingsActions } from '../../../../redux/slices/productSettings.slice';
import { List } from 'office-ui-fabric-react/lib/List';
import StyleGroupItem from './StyleGroupItem';
import { ExpandableItem } from '../../../../interfaces';
import { List as LINQList } from 'linq-typescript';

export const StylesList: React.FC = () => {
  const dispatch = useDispatch();

  const [expandableGroups, setExpandableGroups] = useState<ExpandableItem[]>(
    []
  );

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

  useEffect(() => {
    const oldExpandableList = new LINQList(expandableGroups);

    const incomeGroupsList = new LINQList(outionGroups).select(
      (item: OptionGroup) => {
        let selectResult = new ExpandableItem();
        selectResult.expandKey = `${item.id}`;
        selectResult.item = item;

        const relatedExpandItem = oldExpandableList.firstOrDefault(
          (oldExpandItem) => oldExpandItem.expandKey === selectResult.expandKey
        );

        selectResult.isExpanded = relatedExpandItem
          ? relatedExpandItem.isExpanded
          : false;

        return selectResult;
      }
    );

    setExpandableGroups(incomeGroupsList.toArray());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outionGroups]);

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
    return <StyleGroupItem expandableStyleGroup={item} />;
  };

  return (
    <div
      className="wrapper-list"
      style={{ paddingBottom: '0px', paddingTop: '0px' }}
    >
      {/* <List items={outionGroups} onRenderCell={onRenderCell} /> */}
      <List items={expandableGroups} onRenderCell={onRenderCell} />
    </div>
  );
};

export default StylesList;
