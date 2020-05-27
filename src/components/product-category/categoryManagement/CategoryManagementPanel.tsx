import React, { useState } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { useDispatch, useSelector } from 'react-redux';
import { FormicReference, ProductCategory } from '../../../interfaces';
import { panelStyle } from '../../../common/fabric-styles/styles';
import PanelTitle from '../../dealers/panel/PanelTitle';
import CommonManagementActionBar, {
  buildCommonActionItems,
  hideAddEditPanelActions,
  SAVE_PANEL_ITEM_NAME,
  RESET_PANEL_ITEM_NAME,
} from '../../dealers/panel/CommonManagementActionBar';
import { IApplicationState } from '../../../redux/reducers';
import { ProductManagingPanelComponent } from '../../../redux/slices/product.slice';
import { productActions } from '../../../redux/slices/product.slice';
import ProductCategoryForm from './ProductCategoryForm';
import { assignPendingActions } from '../../../helpers/action.helper';
import ProductCategoryDetails from './ProductCategoryDetails';

export const CategoryManagementPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = setIsDirtyForm;
    })
  );

  const [isDirtyForm, setIsDirtyForm] = useState(false);

  const panelContent: ProductManagingPanelComponent | null = useSelector<
    IApplicationState,
    ProductManagingPanelComponent | null
  >((state) => state.product.productManagementPanelState.panelContent);

  const singleProductForEdit: ProductCategory | null = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.manageSingleProductState.targetProductCategory);

  const targetProductCategoryForDetails: ProductCategory | null = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  let panelTitleText = '';
  let panelDescription = null;
  let panelWidth: number = 0;
  let content: any = '';

  const actionItems = buildCommonActionItems();
  actionItems.forEach((item) => {
    if (item.key === SAVE_PANEL_ITEM_NAME) {
      item.onClick = () => {
        if (
          formikReference.formik !== undefined &&
          formikReference.formik !== null
        ) {
          formikReference.formik.submitForm();
        }
      };

      item.disabled = !isDirtyForm;
    } else if (item.key === RESET_PANEL_ITEM_NAME) {
      item.onClick = () => {
        formikReference.formik.resetForm();
      };

      item.disabled = !isDirtyForm;
    }
  });

  switch (panelContent) {
    case ProductManagingPanelComponent.ProductManaging:
      panelTitleText = 'New Product';
      panelDescription = null;
      panelWidth = 400;

      hideAddEditPanelActions(actionItems);

      content = (
        <ProductCategoryForm
          formikReference={formikReference}
          submitAction={(args: any) => {
            let action = assignPendingActions(
              productActions.apiAddNewProductCategory(args),
              [],
              [],
              (args: any) => {
                dispatch(productActions.changeManagingPanelContent(null));
                dispatch(productActions.apiGetAllProductCategory());
              }
            );

            dispatch(action);
          }}
        />
      );
      break;
    case ProductManagingPanelComponent.EditSingleProduct:
      panelTitleText = 'Details';
      panelDescription = singleProductForEdit
        ? [singleProductForEdit.name]
        : null;
      panelWidth = 400;

      hideAddEditPanelActions(actionItems);

      content = (
        <ProductCategoryForm
          formikReference={formikReference}
          productCategory={singleProductForEdit}
          submitAction={(args: any) => {
            let action = assignPendingActions(
              productActions.apiUpdateProductCategory(args),
              [],
              [],
              (args: any) => {
                dispatch(productActions.changeManagingPanelContent(null));
                dispatch(
                  productActions.changeTargetSingeleManagingProduct(null)
                );
                dispatch(productActions.apiGetAllProductCategory());
              }
            );

            dispatch(action);
          }}
        />
      );

      break;
    case ProductManagingPanelComponent.ProductCategoryDetails:
      const productName = targetProductCategoryForDetails
        ? targetProductCategoryForDetails.name
        : '';

      panelTitleText = `${productName} configuration`;

      panelWidth = 1000;

      hideAddEditPanelActions(actionItems);

      content = (
        <ProductCategoryDetails
          formikReference={formikReference}
          submitAction={(args: any) => {
            dispatch(productActions.toggleIsDetailsformDisabled(true));

            let action = assignPendingActions(
              productActions.apiSaveUpdatedProductGroups(args),
              [productActions.apiGetAllProductCategory()],
              [productActions.toggleIsDetailsformDisabled(false)],
              (args: any) => {
                if (targetProductCategoryForDetails) {
                  let action = assignPendingActions(
                    productActions.apiGetProductCategoryById(
                      targetProductCategoryForDetails?.id
                    ),
                    [productActions.toggleIsDetailsformDisabled(false)],
                    [productActions.toggleIsDetailsformDisabled(false)],
                    (args: any) => {
                      dispatch(productActions.chooseProductCategory(args));
                    },
                    (args: any) => {}
                  );

                  dispatch(action);
                }
              },
              (args: any) => {}
            );

            dispatch(action);
          }}
        />
      );
      break;
    default:
      content = null;
      break;
  }

  return (
    <div className="createDealerPanel">
      <Panel
        styles={panelStyle}
        isOpen={panelContent ? true : false}
        type={PanelType.custom}
        customWidth={`${panelWidth}px`}
        onOuterClick={() => {}}
        onDismiss={() => {
          dispatch(productActions.changeManagingPanelContent(null));
          dispatch(productActions.changeTargetSingeleManagingProduct(null));
          dispatch(productActions.updateOptiongroupsList([]));
        }}
        closeButtonAriaLabel="Close">
        {panelContent !== null &&
        panelContent !== ProductManagingPanelComponent.Unknown ? (
          <>
            <PanelTitle title={panelTitleText} description={panelDescription} />

            <CommonManagementActionBar actionItems={actionItems} />

            {content}
          </>
        ) : null}
      </Panel>
    </div>
  );
};

export default CategoryManagementPanel;
