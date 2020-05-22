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

export const CategoryManagementPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = setIsDirtyForm;
    })
  );

  const [isDirtyForm, setIsDirtyForm] = useState(false);

  let panelTitleText = 'Management Panel';
  let panelDescription = 'Description';
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
            debugger;

            let action = assignPendingActions(
              productCategoryActions.apiAddNewProductCategory(args),
              [],
              [],
              (args: any) => {}
            );

            dispatch(action);
          }}
        />
      );
      break;
    case ProductManagingPanelComponent.Unknown:
      content = null;
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
          /// TODO:

          dispatch(productCategoryActions.changeManagingPanelContent(null));
        }}
        closeButtonAriaLabel="Close"
      >
        <PanelTitle title={panelTitleText} description={panelDescription} />

        <CommonManagementActionBar actionItems={actionItems} />

        {content}
      </Panel>
    </div>
  );
};

export default CategoryManagementPanel;
