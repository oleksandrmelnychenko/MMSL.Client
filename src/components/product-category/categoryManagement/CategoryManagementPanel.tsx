import React, { useState } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { useDispatch, useSelector } from 'react-redux';
import { FormicReference } from '../../../interfaces';
import { panelStyle } from '../../../common/fabric-styles/styles';
import PanelTitle from '../../dealers/panel/PanelTitle';
import CommonManagementActionBar, {
  buildCommonActionItems,
} from '../../dealers/panel/CommonManagementActionBar';
import { IApplicationState } from '../../../redux/reducers';
import { ProductManagingPanelComponent } from '../../../redux/reducers/productCategory.reducer';
import * as productCategoryActions from '../../../redux/actions/productCategory.actions';

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
  let content: any = 'Content';

  const actionItems = buildCommonActionItems();

  const panelContent: ProductManagingPanelComponent | null = useSelector<
    IApplicationState,
    ProductManagingPanelComponent | null
  >((state) => state.product.productManagementPanelState.panelContent);

  switch (panelContent) {
    case ProductManagingPanelComponent.ProductManaging:
      panelTitleText = 'New Product Category';
      panelDescription = '';

      content = 'Product Managing';
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
