import React, { useState, useEffect } from 'react';
import ProfileProduct from './ProfileProduct';
import {
  List,
  Stack,
  FontIcon,
  mergeStyles,
  Text,
} from 'office-ui-fabric-react';
import { IApplicationState } from '../../../../redux/reducers';
import { useSelector } from 'react-redux';
import { ProductCategory } from '../../../../interfaces/products';
import { List as LINQList } from 'linq-typescript';
import { ExpandableItem } from '../../../../interfaces';

export const ProfileList: React.FC = (props: any) => {
  const [expandableProducts, setExpandableProducts] = useState<
    ExpandableItem[]
  >([]);

  const { selectedCustomer } = useSelector<IApplicationState, any>(
    (state) => state.customer.customerState
  );

  const customerProductProfiles: ProductCategory[] = useSelector<
    IApplicationState,
    ProductCategory[]
  >((state) => state.orderProfile.customerProductProfiles);

  useEffect(() => {
    debugger;
    const oldExpandableList = new LINQList(expandableProducts);

    const incomeGroupsList = new LINQList(customerProductProfiles).select(
      (item: ProductCategory) => {
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

    setExpandableProducts(incomeGroupsList.toArray());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerProductProfiles]);

  return (
    <div className="wrapper-list">
      {customerProductProfiles.length > 0 ? (
        <List
          items={expandableProducts}
          onRenderCell={(item: any, index: number | undefined): JSX.Element => {
            return (
              <ProfileProduct
                expandableProfileProduct={item}
                customer={selectedCustomer}
              />
            );
          }}
        />
      ) : (
        <div
          style={{
            marginTop: '15px',
            padding: '6px 6px',
            backgroundColor: 'rgb(240, 240, 240)',
          }}
        >
          <Stack horizontal tokens={{ childrenGap: '6px' }}>
            <FontIcon
              style={{ cursor: 'default' }}
              iconName="Warning"
              className={mergeStyles({
                fontSize: 16,
                position: 'relative',
                top: '-3px',
                color: 'rgba(214,127,60,1)',
              })}
            />
            <Text block>
              {
                "You don't have any available products. Contact to your manufacturer."
              }
            </Text>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default ProfileList;
