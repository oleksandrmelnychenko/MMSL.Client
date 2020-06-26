import React, { useEffect, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productActions } from '../../redux/slices/product.slice';
import {
  ActionButton,
  Stack,
  Icon,
  Image,
  ScrollablePane,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import { Card } from '@uifabric/react-cards';
import { Text } from 'office-ui-fabric-react/lib/Text';
import './product-category.scss';
import { controlActions } from '../../redux/slices/control.slice';
import { IApplicationState } from '../../redux/reducers/index';
import { ProductCategory } from '../../interfaces/products';
import * as fabricStyles from '../../common/fabric-styles/styles';
import { DialogArgs, CommonDialogType } from '../../redux/slices/control.slice';
import CategoryManagementPanel from './categoryManagement/CategoryManagementPanel';
import { ProductManagingPanelComponent } from '../../redux/slices/product.slice';
import { assignPendingActions } from '../../helpers/action.helper';
import ProductManagementPanel from './options/ProductManagementPanel';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

const ProductCategories: React.FC = () => {
  const dispatch = useDispatch();

  const categories = useSelector<IApplicationState, ProductCategory[]>(
    (state) => state.product.productCategory
  );

  const chooseCategory = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  useEffect(() => {
    dispatch(productActions.apiGetAllProductCategoryAnUpdateList());
  }, [dispatch]);

  const deleteProductCategory = (
    event: SyntheticEvent,
    category: ProductCategory
  ) => {
    event.stopPropagation();
    dispatch(
      controlActions.toggleCommonDialogVisibility(
        new DialogArgs(
          CommonDialogType.Delete,
          'Delete product',
          `Are you sure you want to delete ${category.name}?`,
          () => {
            dispatch(productActions.chooseProductCategory(null));
            dispatch(controlActions.closeInfoPanelWithComponent());

            let action = assignPendingActions(
              productActions.apiDeleteProductCategory(category.id),
              [],
              [],
              (args: any) => {
                dispatch(productActions.apiGetAllProductCategoryAnUpdateList());
              }
            );

            dispatch(action);
          },
          () => {}
        )
      )
    );
  };

  const onRendedStyleOptionLabel = (category: any) => {
    let renderResult = null;

    const text = (
      <Text
        className="category_name"
        variant="large"
        block
        nowrap
        styles={{
          root: {
            color: '#505050',
            fontWeight: 400,
            zIndex: 2,
            cursor: 'auto',
            width: '120px',
          },
        }}
      >
        {category.name}
      </Text>
    );

    renderResult = text;

    if (category.name.length > 15) {
      renderResult = (
        <TooltipHost
          id={`styleOption_${category.id}`}
          calloutProps={{ gapSpace: 0 }}
          delay={TooltipDelay.zero}
          directionalHint={DirectionalHint.bottomCenter}
          styles={{
            root: {
              display: 'inline-block',
              zIndex: 2,
              cursor: 'auto',
              width: '120px',
            },
          }}
          content={category.name}
        >
          {text}
        </TooltipHost>
      );
    }

    return renderResult;
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
                        if (category.id !== chooseCategory?.id) {
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
                                  controlActions.openInfoPanelWithComponent({
                                    component: ProductManagementPanel,
                                    onDismisPendingAction: () => {
                                      dispatch(
                                        productActions.chooseProductCategory(
                                          null
                                        )
                                      );
                                    },
                                  })
                                );
                              }
                            )
                          );
                        }
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
                      {onRendedStyleOptionLabel(category)}
                    </Card.Section>
                    <Card.Section
                      className="card_actions"
                      horizontal
                      styles={{
                        ...fabricStyles.footerCardSectionStyles,
                      }}
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
