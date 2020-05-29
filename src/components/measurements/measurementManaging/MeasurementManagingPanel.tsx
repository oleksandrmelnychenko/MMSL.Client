import React, { useState } from 'react';
import {
  Panel,
  PanelType,
  Sticky,
  ScrollablePane,
} from 'office-ui-fabric-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormicReference,
  Measurement,
  MeasurementMapSize,
} from '../../../interfaces';
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
import SizesForm from './SizesForm';
import { assignPendingActions } from '../../../helpers/action.helper';

export const managingScrollablePanelStyle = {
  root: {
    marginLeft: '24px',
    marginRight: '0px',
    marginBottom: '20px',
    marginTop: '50px',
    paddingRight: '24px',
  },
};

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

  const targetSizeChartForEdit:
    | MeasurementMapSize
    | null
    | undefined = useSelector<
    IApplicationState,
    MeasurementMapSize | null | undefined
  >((state) => state.measurements.managingSizeChartState.targetSizeChart);

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

  const onSuccessCreateUpdateMeasurementFlow = (
    affectedMeasurementId: number
  ) => {
    let getAllMeasurementsAction = assignPendingActions(
      measurementActions.apiGetAllMeasurements(),
      [],
      [],
      (args: any) => {
        dispatch(measurementActions.updateMeasurementsList(args));
      },
      (args: any) => {}
    );
    dispatch(getAllMeasurementsAction);

    let getNewMeasurementByIdAction = assignPendingActions(
      measurementActions.apiGetMeasurementById(affectedMeasurementId),
      [],
      [],
      (args: any) => {
        dispatch(measurementActions.changeSelectedMeasurement(args));
        dispatch(
          measurementActions.changeManagingMeasurementPanelContent(null)
        );
      },
      (args: any) => {}
    );
    dispatch(getNewMeasurementByIdAction);
  };

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
                onSuccessCreateUpdateMeasurementFlow(args.body.id);
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
                onSuccessCreateUpdateMeasurementFlow(args.body.id);
              },
              (args: any) => {}
            );

            dispatch(action);
          }}
        />
      );
      break;
    case ManagingMeasurementPanelComponent.AddChartSize:
      panelTitleText = 'Add size';
      panelDescription = [targetMeasurement ? targetMeasurement.name : ''];
      panelWidth = 400;

      hideAddEditPanelActions(actionItems);

      content = (
        <SizesForm
          measurement={targetMeasurement}
          formikReference={formikReference}
          submitAction={(args: any) => {
            let action = assignPendingActions(
              measurementActions.apiCreateNewMeasurementSize(args),
              [],
              [],
              (args: any) => {
                let getNewMeasurementByIdAction = assignPendingActions(
                  measurementActions.apiGetMeasurementById(
                    targetMeasurement ? targetMeasurement.id : 0
                  ),
                  [],
                  [],
                  (args: any) => {
                    dispatch(
                      measurementActions.changeSelectedMeasurement(args)
                    );
                    dispatch(
                      measurementActions.changeManagingMeasurementPanelContent(
                        null
                      )
                    );
                  },
                  (args: any) => {}
                );
                dispatch(getNewMeasurementByIdAction);
              },
              (args: any) => {}
            );

            dispatch(action);
          }}
        />
      );
      break;
    case ManagingMeasurementPanelComponent.EditChartSize:
      panelTitleText = 'Edit size';
      panelDescription = [
        targetSizeChartForEdit?.measurementSize
          ? targetSizeChartForEdit.measurementSize.name
          : '',
        targetMeasurement ? targetMeasurement.name : '',
      ];
      panelWidth = 400;
      hideAddEditPanelActions(actionItems);

      content = (
        <SizesForm
          measurement={targetMeasurement}
          size={targetSizeChartForEdit}
          formikReference={formikReference}
          submitAction={(args: any) => {
            debugger;

            let action = assignPendingActions(
              measurementActions.apiUpdateMeasurementSize(args),
              [],
              [],
              (args: any) => {
                debugger;
                let getNewMeasurementByIdAction = assignPendingActions(
                  measurementActions.apiGetMeasurementById(
                    targetMeasurement ? targetMeasurement.id : 0
                  ),
                  [],
                  [],
                  (args: any) => {
                    debugger;
                    dispatch(
                      measurementActions.changeSelectedMeasurement(args)
                    );
                    dispatch(
                      measurementActions.changeManagingMeasurementPanelContent(
                        null
                      )
                    );
                    dispatch(measurementActions.changeSizeForEdit(null));
                  },
                  (args: any) => {}
                );
                dispatch(getNewMeasurementByIdAction);
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
          dispatch(measurementActions.changeSizeForEdit(null));
        }}
        closeButtonAriaLabel="Close"
      >
        {contentType !== null ? (
          <>
            <ScrollablePane styles={managingScrollablePanelStyle}>
              <Sticky>
                <div style={{ marginRight: '24px' }}>
                  <PanelTitle
                    title={panelTitleText}
                    description={panelDescription}
                  />

                  <CommonManagementActionBar actionItems={actionItems} />
                </div>
              </Sticky>

              <div style={{ marginRight: '24px' }}>{content}</div>
            </ScrollablePane>
          </>
        ) : null}
      </Panel>
    </div>
  );
};

export default MeasurementManagingPanel;
