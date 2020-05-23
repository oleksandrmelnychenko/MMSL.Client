import React, { useEffect, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as productCategoryAction from '../../redux/actions/productCategory.actions';
import {
  ActionButton,
  Stack,
  Icon,
  ScrollablePane,
} from 'office-ui-fabric-react';
import { Card } from '@uifabric/react-cards';
import { Text } from 'office-ui-fabric-react/lib/Text';
import './product-category.scss';
import * as controlAction from '../../redux/actions/control.actions';
import * as productCategoryActions from '../../redux/actions/productCategory.actions';

import { IApplicationState } from '../../redux/reducers/index';
import { ProductCategory } from '../../interfaces';
import {
  scrollablePaneStyleForDetailList,
  backgroundImageCardSectionTokens,
  footerCardSectionStyles,
  footerCardSectionTokens,
  textStyles,
  cardTokens,
} from '../../common/fabric-styles/styles';
import {
  DialogArgs,
  CommonDialogType,
} from '../../redux/reducers/control.reducer';
import CategoryManagementPanel from './categoryManagement/CategoryManagementPanel';
import { ProductManagingPanelComponent } from '../../redux/reducers/productCategory.reducer';
import { assignPendingActions } from '../../helpers/action.helper';
import ProductManagementPanel from './options/ProductManagementPanel';

const ProductCategories: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productCategoryAction.apiGetAllProductCategory());
    return () => {
      dispatch(productCategoryAction.chooseProductCategory(null));
    };
  }, []);

  const categories = useSelector<IApplicationState, ProductCategory[]>(
    (state) => state.product.productCategory
  );

  const chooseCategory = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.chooseCategory
  );

  const deleteProductCategory = (
    event: SyntheticEvent,
    category: ProductCategory
  ) => {
    event.stopPropagation();
    dispatch(
      controlAction.toggleCommonDialogVisibility(
        new DialogArgs(
          CommonDialogType.Delete,
          'Delete category',
          `Are you sure you want to delete ${category.name}?`,
          () => {
            let action = assignPendingActions(
              productCategoryAction.apiDeleteProductCategory(category.id),
              [],
              [],
              (args: any) => {
                dispatch(productCategoryActions.apiGetAllProductCategory());
              }
            );

            dispatch(action);
          },
          () => {}
        )
      )
    );
  };

  return (
    <div className="content__root">
      <div className="content__header">
        <div className="content__header__top">
          <Stack horizontal>
            <div className="content__header__top__title">Product Category</div>
            <div className="content__header__top__controls">
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <div className="content__header__top__controls__control">
                  <ActionButton
                    className="dealerAdd"
                    onClick={() => {
                      dispatch(
                        productCategoryActions.changeManagingPanelContent(
                          ProductManagingPanelComponent.ProductManaging
                        )
                      );
                    }}
                    iconProps={{ iconName: 'Add' }}>
                    New Category
                  </ActionButton>
                </div>
              </Stack>
            </div>
          </Stack>
        </div>
      </div>
      <ScrollablePane styles={scrollablePaneStyleForDetailList}>
        <div className="categories">
          {categories.map((category) => (
            <div key={category.id} style={{ margin: '12px' }}>
              <Card
                className={chooseCategory?.id === category.id ? `selected` : ''}
                onClick={() => {
                  dispatch(
                    productCategoryAction.chooseProductCategory(category)
                  );
                  dispatch(
                    controlAction.openInfoPanelWithComponent(
                      ProductManagementPanel
                    )
                  );
                }}
                tokens={cardTokens}>
                <Card.Section
                  fill
                  verticalAlign="end"
                  styles={{
                    root: {
                      position: 'relative',
                      paddingBottom: 0,
                      marginBottom: '20px',
                      backgroundImage: `url(${category.imageUrl})`,
                      backgroundPosition: 'top center',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      height: 220,
                      alignItems: 'center',
                    },
                  }}
                  tokens={backgroundImageCardSectionTokens}>
                  <Text
                    className="category_name"
                    variant="large"
                    styles={textStyles}>
                    {category.name}
                  </Text>
                </Card.Section>
                <Card.Section
                  horizontal
                  styles={footerCardSectionStyles}
                  tokens={footerCardSectionTokens}>
                  <Stack.Item grow={1}>
                    <span />
                  </Stack.Item>
                  <Icon
                    iconName="Edit"
                    styles={{
                      root: {
                        color: '#0078d4',
                        marginLeft: '5px',
                        marginRight: '5px',
                      },
                    }}
                  />
                  <Icon
                    iconName="Delete"
                    styles={{
                      root: {
                        color: '#a4262c',
                      },
                    }}
                    onClick={(event: SyntheticEvent) =>
                      deleteProductCategory(event, category)
                    }
                  />
                </Card.Section>
              </Card>
            </div>
          ))}
        </div>
      </ScrollablePane>

      <CategoryManagementPanel />
    </div>
  );
};

export default ProductCategories;
