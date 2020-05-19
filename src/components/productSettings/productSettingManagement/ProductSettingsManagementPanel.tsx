import React, { useState } from 'react';
import {
  ICommandBarItemProps,
  Panel,
  PanelType,
  CommandBar,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { FormicReference } from '../../../interfaces';
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
import OptionGroupDetails from './OptionGroupDetails';

export const ProductSettingsManagementPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = (isDirty: boolean) => {
        setIsDirtyForm(isDirty);
      };
    })
  );

  const [isDirtyForm, setIsDirtyForm] = useState(false);

  const panelContent: ManagingPanelComponent | null = useSelector<
    IApplicationState,
    ManagingPanelComponent | null
  >((state) => state.productSettings.managingPanelContent);

  const _items: ICommandBarItemProps[] = [
    {
      key: 'Save',
      text: 'Save',
      disabled: !isDirtyForm,
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
  ];

  let panelTitleText = 'Management Panel';
  let panelWidth = '600px';
  let content: any = null;

  if (panelContent === ManagingPanelComponent.ManageGroups) {
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
        }}
      />
    );
  } else if (panelContent === ManagingPanelComponent.ManageUnits) {
    panelTitleText = 'Manage Option Units';
    panelWidth = '900px';
    content = <OptionGroupDetails />;
  }

  return (
    <div className="createDealerPanel">
      <Panel
        styles={panelStyle}
        isOpen={panelContent ? true : false}
        type={PanelType.custom}
        customWidth={panelWidth}
        onDismiss={() => {
          dispatch(productSettingsActions.managingPanelContent(null));
          dispatch(
            productSettingsActions.changeTargetOptionGroupForUnitsEdit(null)
          );
        }}
        closeButtonAriaLabel="Close"
      >
        <PanelTitle
          onSaveClick={() => {
            let formik: any = formikReference.formik;

            if (formik !== undefined && formik !== null) {
              formik.submitForm();
            }
          }}
          title={panelTitleText}
        />
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
