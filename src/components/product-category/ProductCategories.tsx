import React, { useEffect, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productActions } from '../../redux/slices/product.slice';
import {
  ActionButton,
  Stack,
  Icon,
  ScrollablePane,
} from 'office-ui-fabric-react';
import { Card } from '@uifabric/react-cards';
import { Text } from 'office-ui-fabric-react/lib/Text';
import './product-category.scss';
import { controlActions } from '../../redux/slices/control.slice';
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
import { DialogArgs, CommonDialogType } from '../../redux/slices/control.slice';
import CategoryManagementPanel from './categoryManagement/CategoryManagementPanel';
import { ProductManagingPanelComponent } from '../../redux/slices/product.slice';
import { assignPendingActions } from '../../helpers/action.helper';
import ProductManagementPanel from './options/ProductManagementPanel';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

const ProductCategories: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productActions.apiGetAllProductCategory());
    return () => {
      // dispatch(productCategoryAction.chooseProductCategory(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = useSelector<IApplicationState, ProductCategory[]>(
    (state) => state.product.productCategory
  );

  const chooseCategory = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  const deleteProductCategory = (
    event: SyntheticEvent,
    category: ProductCategory
  ) => {
    event.stopPropagation();
    dispatch(
      controlActions.toggleCommonDialogVisibility(
        new DialogArgs(
          CommonDialogType.Delete,
          'Delete category',
          `Are you sure you want to delete ${category.name}?`,
          () => {
            dispatch(productActions.chooseProductCategory(null));
            dispatch(controlActions.closeInfoPanelWithComponent());

            let action = assignPendingActions(
              productActions.apiDeleteProductCategory(category.id),
              [],
              [],
              (args: any) => {
                dispatch(productActions.apiGetAllProductCategory());
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
            <div className="content__header__top__title">Products</div>
            <div className="content__header__top__controls">
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <div className="content__header__top__controls__control">
                  <ActionButton
                    className="dealerAdd"
                    onClick={() => {
                      dispatch(
                        productActions.changeManagingPanelContent(
                          ProductManagingPanelComponent.ProductManaging
                        )
                      );
                    }}
                    iconProps={{ iconName: 'Add' }}>
                    New Product
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
            <div key={category.id} style={{ margin: '12px 24px 12px 0' }}>
              <Card
                styles={{ root: { padding: '9px' } }}
                className={chooseCategory?.id === category.id ? `selected` : ''}
                onClick={(args: any) => {
                  const className: any = args?.target?.className;

                  if (!className.includes(DATA_SELECTION_DISABLED_CLASS)) {
                    let action = assignPendingActions(
                      productActions.apiGetProductCategoryById(category.id),
                      [],
                      [],
                      (args: any) => {
                        dispatch(productActions.chooseProductCategory(args));
                        dispatch(
                          controlActions.openInfoPanelWithComponent(
                            ProductManagementPanel
                          )
                        );
                      }
                    );

                    dispatch(action);
                  }
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
                    className={DATA_SELECTION_DISABLED_CLASS}
                    iconName="Edit"
                    title="Edit"
                    ariaLabel="Edit"
                    styles={{
                      root: {
                        color: '#0078d4',
                        marginLeft: '5px',
                        marginRight: '5px',
                      },
                    }}
                    onClick={() => {
                      let action = assignPendingActions(
                        productActions.apiGetProductCategoryById(category.id),
                        [
                          productActions.changeManagingPanelContent(
                            ProductManagingPanelComponent.EditSingleProduct
                          ),
                        ],
                        [],
                        (args: any) => {
                          dispatch(
                            productActions.changeTargetSingeleManagingProduct(
                              args
                            )
                          );
                        }
                      );

                      dispatch(action);
                    }}
                  />
                  <Icon
                    className={DATA_SELECTION_DISABLED_CLASS}
                    iconName="Delete"
                    title="Delete"
                    ariaLabel="Delete"
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
