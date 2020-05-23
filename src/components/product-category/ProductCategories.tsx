import React, { useEffect, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as productCategoryAction from '../../redux/actions/productCategory.actions';
import {
  ActionButton,
  Stack,
  Icon,
  ScrollablePane,
} from 'office-ui-fabric-react';
import {
  Card,
  ICardTokens,
  ICardSectionStyles,
  ICardSectionTokens,
} from '@uifabric/react-cards';
import { Text, ITextStyles } from 'office-ui-fabric-react/lib/Text';
import './product-category.scss';
import * as controlAction from '../../redux/actions/control.actions';
// Import IMG
import * as productCategoryActions from '../../redux/actions/productCategory.actions';
import productImage from '../../assets/images/product/shirt.jpg';
import { IApplicationState } from '../../redux/reducers/index';
import { ProductCategory } from '../../interfaces';
import { scrollablePaneStyleForDetailList } from '../../common/fabric-styles/styles';
import {
  DialogArgs,
  CommonDialogType,
} from '../../redux/reducers/control.reducer';
import CategoryManagementPanel from './categoryManagement/CategoryManagementPanel';
import { ProductManagingPanelComponent } from '../../redux/reducers/productCategory.reducer';
import { assignPendingActions } from '../../helpers/action.helper';

const ProductCategories: React.FC = () => {
  const cardTokens: ICardTokens = {
    childrenGap: '12px',
    maxWidth: '200px',
    maxHeight: '200px',
    height: '200px',
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productCategoryAction.apiGetAllProductCategory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = useSelector<IApplicationState, ProductCategory[]>(
    (state) => state.product.productCategory
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

  const backgroundImageCardSectionTokens: ICardSectionTokens = { padding: 12 };
  const textStyles: ITextStyles = {
    root: {
      color: '#505050',
      fontWeight: 400,
      position: 'absolute',
      bottom: '-30px',
    },
  };

  const footerCardSectionStyles: ICardSectionStyles = {
    root: {
      paddingLeft: '12px',
      paddingRight: '12px',
      paddingBottom: '5px',
      borderTop: '1px solid #F3F2F1',
    },
  };

  const footerCardSectionTokens: ICardSectionTokens = {
    padding: '12px 0px 0px',
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
                    iconProps={{ iconName: 'Add' }}
                  >
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
                onClick={() => {
                  console.log('ACTION');
                }}
                tokens={cardTokens}
              >
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
                  tokens={backgroundImageCardSectionTokens}
                >
                  <Text variant="large" styles={textStyles}>
                    {category.name}
                  </Text>
                </Card.Section>
                <Card.Section
                  horizontal
                  styles={footerCardSectionStyles}
                  tokens={footerCardSectionTokens}
                >
                  <Icon
                    styles={{
                      root: {
                        color: '#0078d4',
                        marginLeft: '5px',
                        marginRight: '5px',
                      },
                    }}
                    iconName="Design"
                    onClick={(event: any) => {
                      event.stopPropagation();
                      console.log('ICON ACTION');
                    }}
                  />
                  <Icon
                    iconName="SingleColumnEdit"
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
                        productCategoryActions.apiGetProductCategoryById(
                          category.id
                        ),
                        [
                          productCategoryActions.changeManagingPanelContent(
                            ProductManagingPanelComponent.EditSingleProduct
                          ),
                        ],
                        [],
                        (args: any) => {
                          dispatch(
                            productCategoryActions.changeTargetSingeleManagingProduct(
                              args
                            )
                          );
                        }
                      );

                      dispatch(action);
                    }}
                  />
                  <Icon
                    iconName="Timeline"
                    styles={{
                      root: {
                        color: '#0078d4',
                        marginLeft: '5px',
                        marginRight: '5px',
                      },
                    }}
                  />
                  <Stack.Item grow={1}>
                    <span />
                  </Stack.Item>
                  <Icon
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
