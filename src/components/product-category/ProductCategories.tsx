import React, { useEffect, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productActions } from '../../redux/slices/product.slice';
import {
  ActionButton,
  Stack,
  Icon,
  Image,
  ScrollablePane,
} from 'office-ui-fabric-react';
import { Card } from '@uifabric/react-cards';
import { Text } from 'office-ui-fabric-react/lib/Text';
import './product-category.scss';
import { controlActions } from '../../redux/slices/control.slice';
import { IApplicationState } from '../../redux/reducers/index';
import { ProductCategory } from '../../interfaces';
import * as fabricStyles from '../../common/fabric-styles/styles';
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
  }, [dispatch]);

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
      <Stack verticalAlign="space-around">
        <Stack.Item align="stretch">
          <div className="content__header">
            <div className="content__header__top">
              <Stack
                horizontal
                verticalAlign="center"
                tokens={fabricStyles.horizontalGapStackTokens}
              >
                <Text
                  variant="xLarge"
                  block
                  styles={fabricStyles.mainTitleContent}
                >
                  Products
                </Text>
                <ActionButton
                  className="dealerAdd"
                  onClick={() => {
                    dispatch(
                      productActions.changeManagingPanelContent(
                        ProductManagingPanelComponent.ProductManaging
                      )
                    );
                  }}
                  iconProps={{ iconName: 'Add' }}
                >
                  New Product
                </ActionButton>
              </Stack>
            </div>
          </div>
        </Stack.Item>
        <Stack.Item>
          <ScrollablePane
            styles={fabricStyles.scrollablePaneStyleForDetailList}
          >
            <div className="categories">
              {categories.map((category) => (
                <div
                  className="card"
                  key={category.id}
                  style={{ margin: '12px 24px 12px 0', position: 'relative' }}
                >
                  <Card
                    styles={fabricStyles.cardStyle}
                    className={
                      chooseCategory?.id === category.id ? `selected` : ''
                    }
                    onClick={(args: any) => {
                      const className: any = args?.target?.className;

                      if (!className.includes(DATA_SELECTION_DISABLED_CLASS)) {
                        dispatch(
                          assignPendingActions(
                            productActions.apiGetProductCategoryById(
                              category.id
                            ),
                            [],
                            [],
                            (args: any) => {
                              dispatch(
                                productActions.chooseProductCategory(args)
                              );
                              dispatch(
                                controlActions.openInfoPanelWithComponent(
                                  ProductManagementPanel
                                )
                              );
                            }
                          )
                        );
                      }
                    }}
                    tokens={fabricStyles.cardTokens}
                  >
                    <Card.Section fill verticalAlign="end">
                      <Image
                        src={category.imageUrl}
                        styles={fabricStyles.marginImageCenter}
                      ></Image>
                    </Card.Section>
                    <Card.Section>
                      <Text
                        className="category_name"
                        variant="large"
                        styles={fabricStyles.textStyles}
                      >
                        {category.name}
                      </Text>
                    </Card.Section>
                    <Card.Section
                      className="card_actions"
                      horizontal
                      styles={fabricStyles.footerCardSectionStyles}
                      tokens={fabricStyles.footerCardSectionTokens}
                    >
                      <Icon
                        className={DATA_SELECTION_DISABLED_CLASS}
                        iconName="Edit"
                        title="Edit"
                        ariaLabel="Edit"
                        styles={fabricStyles.editCardIcon}
                        onClick={() => {
                          let action = assignPendingActions(
                            productActions.apiGetProductCategoryById(
                              category.id
                            ),
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
                        styles={fabricStyles.deleteIconRedColor}
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
        </Stack.Item>
      </Stack>

      <CategoryManagementPanel />
    </div>
  );
};

export default ProductCategories;
