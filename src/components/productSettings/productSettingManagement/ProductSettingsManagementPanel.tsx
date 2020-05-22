import React, { useState, useEffect } from 'react';
import {
  ICommandBarItemProps,
  Panel,
  PanelType,
  CommandBar,
  ActionButton,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { FormicReference, OptionGroup, OptionUnit } from '../../../interfaces';
import {
  panelStyle,
  commandBarStyles,
  commandBarButtonStyles,
} from '../../../common/fabric-styles/styles';
import PanelTitle from '../../dealers/panel/PanelTitle';
import ManagingProductGroupForm from './ManagingProductGroupForm';
import * as productSettingsActions from '../../../redux/actions/productSettings.actions';
import { ManagingPanelComponent } from '../../../redux/reducers/productSettings.reducer';
import { assignPendingActions } from '../../../helpers/action.helper';
import { List } from 'linq-typescript';
import { OptionGroupDetails } from './OptionGroupDetails';
import ManagingProductUnitForm from './ManagingProductUnitForm';

const NEW_PANEL_ITEM_NAME = 'New';
const DELETE_PANEL_ITEM_NAME = 'Delete';

/// Simply hides "Add" and "Edit" panel buttons
const hideAddEditPanelActions = (actions: ICommandBarItemProps[]) => {
  const saveButton = new List(actions).firstOrDefault(
    (item) => item.key === NEW_PANEL_ITEM_NAME
  );
  const deleteButton = new List(actions).firstOrDefault(
    (item) => item.key === DELETE_PANEL_ITEM_NAME
  );

  if (saveButton)
    saveButton.buttonStyles = {
      root: { display: 'none' },
    };

  if (deleteButton)
    deleteButton.buttonStyles = {
      root: { display: 'none' },
    };
};

export const ProductSettingsManagementPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = setIsDirtyForm;
    })
  );

  const [isDirtyForm, setIsDirtyForm] = useState(false);

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

  const sectedSingleOptionGroup: OptionGroup | null | undefined = useSelector<
    IApplicationState,
    OptionGroup | null | undefined
  >((state) => state.productSettings.manageSingleOptionGroupState.optionGroup);

  let _items: ICommandBarItemProps[] = [
    {
      key: NEW_PANEL_ITEM_NAME,
      text: NEW_PANEL_ITEM_NAME,
      iconProps: { iconName: 'Add' },
      onClick: () => {},
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: 'Save',
      text: 'Save',
      disabled: formikReference.formik ? !formikReference.formik.dirty : true,
      iconProps: { iconName: 'Save' },
      onClick: () => {
        let formik: any = formikReference.formik;

        if (formik !== undefined && formik !== null) {
          formik.submitForm();
        }
      },
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: 'Reset',
      text: 'Reset',
      disabled: !isDirtyForm,
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        formikReference.formik.resetForm();
      },
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: DELETE_PANEL_ITEM_NAME,
      text: DELETE_PANEL_ITEM_NAME,
      iconProps: { iconName: 'Delete' },
      disabled: true,
      onClick: () => {},
      buttonStyles: commandBarButtonStyles,
    },
  ];

  let panelTitleText = 'Management Panel';
  let panelDescription = '';
  let panelWidth: number = 600;
  let content: any = null;

  if (panelContent === ManagingPanelComponent.ManageGroups) {
    hideAddEditPanelActions(_items);
    panelWidth = 420;
    panelTitleText = 'New Option Group';

    content = (
      <ManagingProductGroupForm
        formikReference={formikReference}
        submitAction={(args: any) => {
          let createAction = assignPendingActions(
            productSettingsActions.saveNewOptionGroup(args),
            [
              productSettingsActions.managingPanelContent(null),
              productSettingsActions.getAllOptionGroupsList(),
            ]
          );
          dispatch(createAction);

          formikReference.formik.resetForm();
        }}
      />
    );
  } else if (panelContent === ManagingPanelComponent.ManageUnits) {
    panelTitleText = 'Manage Option Units';
    panelWidth = 700;
    if (sectedOptionGroup) {
      panelDescription = sectedOptionGroup.name;
    }

    content = (
      <OptionGroupDetails
        panelNewButton={new List(_items).firstOrDefault(
          (item) => item.key === NEW_PANEL_ITEM_NAME
        )}
        panelDeleteButton={new List(_items).firstOrDefault(
          (item) => item.key === DELETE_PANEL_ITEM_NAME
        )}
        relativeOptionGroupId={0}
        formikReference={formikReference}
        submitAction={(args: any) => {}}
      />
    );
  } else if (panelContent === ManagingPanelComponent.ManageSingleOptionUnit) {
    panelWidth = 420;
    panelTitleText = 'Details';
    if (sectedSingleOptionUnit) {
      panelDescription = sectedSingleOptionUnit.value;
    }
    hideAddEditPanelActions(_items);

    content = (
      <ManagingProductUnitForm
        formikReference={formikReference}
        optionUnit={sectedSingleOptionUnit}
        relativeOptionGroupId={sectedOptionGroup?.id}
        submitAction={(args: any) => {
          let action = assignPendingActions(
            productSettingsActions.updateOptionUnit(args),
            [
              productSettingsActions.getAllOptionGroupsList(),
              productSettingsActions.changeTargetOptionGroupForUnitsEdit(null),
              productSettingsActions.managingPanelContent(null),
            ],
            [],
            (args: any) => {
              dispatch(productSettingsActions.updateSingleEditOptionUnit(null));
            }
          );

          dispatch(action);
        }}
      />
    );
  } else if (panelContent === ManagingPanelComponent.ManageSingleOptionGroup) {
    hideAddEditPanelActions(_items);
    panelWidth = 420;
    panelTitleText = 'Details';
    if (sectedSingleOptionGroup) {
      panelDescription = sectedSingleOptionGroup.name;
    }

    content = (
      <ManagingProductGroupForm
        formikReference={formikReference}
        OptionGroupToEdit={sectedSingleOptionGroup}
        submitAction={(args: any) => {
          let createAction = assignPendingActions(
            productSettingsActions.saveEditOptionGroup(args),
            [],
            [],
            () => {
              dispatch(productSettingsActions.getAllOptionGroupsList());
              formikReference.formik.resetForm();
              dispatch(productSettingsActions.managingPanelContent(null));
              dispatch(
                productSettingsActions.updateTargetSingleEditOptionGroup(null)
              );
            }
          );
          dispatch(createAction);
        }}
      />
    );
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
          dispatch(
            productSettingsActions.updateTargetSingleEditOptionGroup(null)
          );
        }}
        closeButtonAriaLabel="Close"
      >
        <PanelTitle title={panelTitleText} description={panelDescription} />

        <CommandBar
          styles={commandBarStyles}
          items={_items}
          className="dealers__store__controls"
        />
        {content}
      </Panel>
    </div>
  );
};

export default ProductSettingsManagementPanel;
