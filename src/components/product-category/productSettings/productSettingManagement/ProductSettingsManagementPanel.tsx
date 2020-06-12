import React, { useState } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../../redux/reducers';
import { FormicReference } from '../../../../interfaces';
import { OptionGroup, OptionUnit } from '../../../../interfaces/options';
import { ProductCategory } from '../../../../interfaces/products';
import { panelStyle } from '../../../../common/fabric-styles/styles';
import PanelTitle from '../../../dealers/panel/PanelTitle';
import { productSettingsActions } from '../../../../redux/slices/productSettings.slice';
import { ManagingPanelComponent } from '../../../../redux/slices/productSettings.slice';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { List } from 'linq-typescript';
import { OptionGroupDetails } from './OptionGroupDetails';
import ManagingProductUnitForm from './ManagingProductUnitForm';
import CommonManagementActionBar, {
  buildCommonActionItems,
  SAVE_PANEL_ITEM_NAME,
  RESET_PANEL_ITEM_NAME,
  hideAddEditPanelActions,
  NEW_PANEL_ITEM_NAME,
  DELETE_PANEL_ITEM_NAME,
} from '../../../dealers/panel/CommonManagementActionBar';

export const ProductSettingsManagementPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = setIsDirtyForm;
    })
  );

  const [isDirtyForm, setIsDirtyForm] = useState(false);

  const targetProduct: ProductCategory | null = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const panelContent: ManagingPanelComponent | null = useSelector<
    IApplicationState,
    ManagingPanelComponent | null
  >((state) => state.productSettings.managingPanelContent);

  const sectedOptionGroup: OptionGroup | null | undefined = useSelector<
    IApplicationState,
    OptionGroup | null | undefined
  >(
    (state) => state.productSettings.managingOptionUnitsState.targetOptionGroup
  );

  const sectedSingleOptionUnit: OptionUnit | null | undefined = useSelector<
    IApplicationState,
    OptionUnit | null | undefined
  >((state) => state.productSettings.manageSingleOptionUnitState.optionUnit);

  // const sectedSingleOptionGroup: OptionGroup | null | undefined = useSelector<
  //   IApplicationState,
  //   OptionGroup | null | undefined
  // >((state) => state.productSettings.manageSingleOptionGroupState.optionGroup);

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

  let panelTitleText = 'Management Panel';
  let panelDescription = null;
  let panelWidth: number = 600;
  let content: any = null;

  const getProductStyles: (productId: number) => void = (productId: number) => {
    dispatch(
      assignPendingActions(
        productSettingsActions.apiGetAllOptionGroupsByProductIdList(productId),
        [],
        [],
        (args: any) => {
          dispatch(productSettingsActions.updateOptionGroupList(args));
        },
        (args: any) => {}
      )
    );
  };

  if (panelContent === ManagingPanelComponent.ManageUnits) {
    panelTitleText = 'Manage Style';
    panelWidth = 700;
    if (sectedOptionGroup) {
      panelDescription = [sectedOptionGroup.name];
    }

    // content = (
    //   <OptionGroupDetails
    //     panelNewButton={new List(actionItems).firstOrDefault(
    //       (item) => item.key === NEW_PANEL_ITEM_NAME
    //     )}
    //     panelDeleteButton={new List(actionItems).firstOrDefault(
    //       (item) => item.key === DELETE_PANEL_ITEM_NAME
    //     )}
    //     relativeOptionGroupId={0}
    //     formikReference={formikReference}
    //     submitAction={(args: any) => {}}
    //   />
    // );
  } else if (panelContent === ManagingPanelComponent.ManageSingleOptionUnit) {
    panelWidth = 420;
    panelTitleText = 'Details';
    if (sectedSingleOptionUnit) {
      panelDescription = [sectedSingleOptionUnit.value];
    }
    hideAddEditPanelActions(actionItems);

    // content = (
    // <ManagingProductUnitForm
    //   formikReference={formikReference}
    //   optionUnit={sectedSingleOptionUnit}
    //   relativeOptionGroupId={sectedOptionGroup?.id}
    //   submitAction={(args: any) => {
    //     let action = assignPendingActions(
    //       productSettingsActions.updateOptionUnit(args),
    //       [
    //         productSettingsActions.changeTargetOptionGroupForUnitsEdit(null),
    //         productSettingsActions.managingPanelContent(null),
    //       ],
    //       [],
    //       (args: any) => {
    //         dispatch(productSettingsActions.updateSingleEditOptionUnit(null));

    //         if (targetProduct?.id) getProductStyles(targetProduct.id);
    //       }
    //     );

    //     dispatch(action);
    //   }}
    // />
    // );
  } else {
    panelWidth = 0;
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
          dispatch(productSettingsActions.managingPanelContent(null));
          dispatch(
            productSettingsActions.changeTargetOptionGroupForUnitsEdit(null)
          );
          dispatch(productSettingsActions.updateSingleEditOptionUnit(null));
          // dispatch(
          //   productSettingsActions.updateTargetSingleEditOptionGroup(null)
          // );
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

export default ProductSettingsManagementPanel;
