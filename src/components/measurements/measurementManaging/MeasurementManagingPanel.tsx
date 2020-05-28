import React, { useState } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { useDispatch, useSelector } from 'react-redux';
import { FormicReference, Measurement } from '../../../interfaces';
import { panelStyle } from '../../../common/fabric-styles/styles';
import PanelTitle from '../../dealers/panel/PanelTitle';
import CommonManagementActionBar, {
  buildCommonActionItems,
  SAVE_PANEL_ITEM_NAME,
  RESET_PANEL_ITEM_NAME,
  hideAddEditPanelActions,
} from '../../dealers/panel/CommonManagementActionBar';
import { IApplicationState } from '../../../redux/reducers';
import { ManagingMeasurementPanelComponent } from '../../../redux/slices/measurement.slice';
import MeasurementForm from './MeasurementForm';
import { measurementActions } from '../../../redux/slices/measurement.slice';
import MeasurementEditForm from './MeasurementEditForm';
import { assignPendingActions } from '../../../helpers/action.helper';
import { List } from 'linq-typescript';

export const MeasurementManagingPanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = setIsDirtyForm;
    })
  );

  const [isDirtyForm, setIsDirtyForm] = useState(false);

  const contentType: ManagingMeasurementPanelComponent | null = useSelector<
    IApplicationState,
    ManagingMeasurementPanelComponent | null
  >((state) => state.measurements.managingMeasurementPanelContent);

  const targetMeasurement: Measurement | null | undefined = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.measurements.targetMeasurement);

  let panelTitleText = '';
  let panelDescription: string[] | null = null;
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

  switch (contentType) {
    case ManagingMeasurementPanelComponent.CreateNewMeasurement:
      panelTitleText = 'New Measurement';
      panelDescription = [];
      panelWidth = 400;

      hideAddEditPanelActions(actionItems);

      content = (
        <MeasurementForm
          formikReference={formikReference}
          submitAction={(args: any) => {
            let action = assignPendingActions(
              measurementActions.apiCreateNewMeasurement(args),
              [],
              [],
              (args: any) => {
                let action = assignPendingActions(
                  measurementActions.apiGetAllMeasurements(),
                  [
                    measurementActions.changeManagingMeasurementPanelContent(
                      null
                    ),
                  ],
                  [],
                  (args: any) => {
                    dispatch(measurementActions.updateMeasurementsList(args));
                    dispatch(
                      measurementActions.changeSelectedMeasurement(
                        new List<Measurement>(args).firstOrDefault()
                      )
                    );
                  },
                  (args: any) => {}
                );

                dispatch(action);
              },
              (args: any) => {}
            );

            dispatch(action);
          }}
        />
      );
      break;

    case ManagingMeasurementPanelComponent.EditMeasurement:
      panelTitleText = 'Edit';
      panelDescription = [targetMeasurement ? targetMeasurement.name : ''];
      panelWidth = 400;

      hideAddEditPanelActions(actionItems);

      content = (
        <MeasurementForm
          measurement={targetMeasurement}
          formikReference={formikReference}
          submitAction={(args: any) => {
            let action = assignPendingActions(
              measurementActions.apiUpdateMeasurement(args),
              [],
              [],
              (args: any) => {
                let action = assignPendingActions(
                  measurementActions.apiGetAllMeasurements(),
                  [
                    measurementActions.changeManagingMeasurementPanelContent(
                      null
                    ),
                  ],
                  [],
                  (args: any) => {
                    dispatch(measurementActions.updateMeasurementsList(args));
                    dispatch(
                      measurementActions.changeSelectedMeasurement(
                        new List<Measurement>(args).firstOrDefault()
                      )
                    );
                  },
                  (args: any) => {}
                );

                dispatch(action);
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
        isOpen={contentType !== null ? true : false}
        type={PanelType.custom}
        customWidth={`${panelWidth}px`}
        onOuterClick={() => {}}
        onDismiss={() => {
          dispatch(
            measurementActions.changeManagingMeasurementPanelContent(null)
          );
        }}
        closeButtonAriaLabel="Close"
      >
        {contentType !== null ? (
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

export default MeasurementManagingPanel;
