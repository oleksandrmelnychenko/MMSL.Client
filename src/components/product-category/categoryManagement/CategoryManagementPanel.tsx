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
import { ProductManagingPanelComponent } from '../../../redux/reducers/productCategory.reducer';
import * as productCategoryActions from '../../../redux/actions/productCategory.actions';
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

  let panelTitleText = '';
  let panelDescription = '';
  let panelWidth: number = 600;
  let content: any = '';

  const actionItems = buildCommonActionItems();
  actionItems.forEach((item) => {
    if (item.key === SAVE_PANEL_ITEM_NAME) {
      item.onClick = () => {
        let formik: any = formikReference.formik;

        if (formik !== undefined && formik !== null) {
          formik.submitForm();
        }
      };

      item.disabled = formikReference.formik
        ? !formikReference.formik.dirty
        : true;
    } else if (item.key === RESET_PANEL_ITEM_NAME) {
      item.onClick = () => {
        formikReference.formik.resetForm();
      };

      item.disabled = !isDirtyForm;
    }
  });

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

  switch (panelContent) {
    case ProductManagingPanelComponent.ProductManaging:
      panelTitleText = 'New Product Category';
      panelDescription = '';
      panelWidth = 400;

      hideAddEditPanelActions(actionItems);

      content = (
        <ProductCategoryForm
          formikReference={formikReference}
          submitAction={(args: any) => {
            let action = assignPendingActions(
              productCategoryActions.apiAddNewProductCategory(args),
              [],
              [],
              (args: any) => {
                dispatch(
                  productCategoryActions.changeManagingPanelContent(null)
                );
                dispatch(productCategoryActions.apiGetAllProductCategory());
              }
            );

            dispatch(action);
          }}
        />
      );
      break;
    case ProductManagingPanelComponent.EditSingleProduct:
      panelTitleText = 'Details';
      panelDescription = singleProductForEdit ? singleProductForEdit.name : '';
      panelWidth = 400;

      hideAddEditPanelActions(actionItems);

      content = (
        <ProductCategoryForm
          formikReference={formikReference}
          productCategory={singleProductForEdit}
          submitAction={(args: any) => {
            let action = assignPendingActions(
              productCategoryActions.apiUpdateProductCategory(args),
              [],
              [],
              (args: any) => {
                dispatch(
                  productCategoryActions.changeManagingPanelContent(null)
                );
                dispatch(
                  productCategoryActions.changeTargetSingeleManagingProduct(
                    null
                  )
                );
                dispatch(productCategoryActions.apiGetAllProductCategory());
              }
            );

            dispatch(action);
          }}
        />
      );

      break;
    case ProductManagingPanelComponent.ProductCategoryDetails:
      panelTitleText = 'Manage Option Groups';
      panelDescription = targetProductCategoryForDetails
        ? targetProductCategoryForDetails.name
        : '';
      panelWidth = 700;

      hideAddEditPanelActions(actionItems);

      content = <ProductCategoryDetails />;
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
          dispatch(productCategoryActions.changeManagingPanelContent(null));
          dispatch(
            productCategoryActions.changeTargetSingeleManagingProduct(null)
          );
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
