import React, { useState, useEffect } from 'react';

import {
  Panel,
  PanelType,
  CommandBar,
  ICommandBarItemProps,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';

import {
  panelStyle,
  commandBarStyles,
  commandBarButtonStyles,
} from '../../common/fabric-styles/styles';
import { IApplicationState } from '../../redux/reducers/index';
import TimelineForm from './TimelineForm';
import { FormicReference } from '../../interfaces';
import { productSettingsActions } from '../../redux/slices/productSettings.slice';
import PanelTitle from '../dealers/panel/PanelTitle';
import { DeliveryTimeline } from '../../interfaces/index';

export const TimelinePanel: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [isDirtyForm, setIsDirtyForm] = useState(false);

  const [formikReference] = useState<FormicReference>(
    new FormicReference(() => {
      formikReference.isDirtyFunc = (isDirty: boolean) => {
        setIsDirtyForm(isDirty);
      };
    })
  );

  const isTimelineFormPanelOpen = useSelector<IApplicationState, boolean>(
    (state) => state.productSettings.manageTimelineState.isTimelineFormPanelOpen
  );

  let customWidth: string = '400px';

  useEffect(() => {
    return () => {
      dispatch(productSettingsActions.clearSelectedDeliveryTimeLine());
    };
  }, []);

  const selectedDeliveryTimeline = useSelector<
    IApplicationState,
    DeliveryTimeline | null
  >(
    (state) =>
      state.productSettings.manageTimelineState.selectedDeliveryTimeline
  );

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

  return (
    <Panel
      onOuterClick={() => {}}
      styles={panelStyle}
      isOpen={isTimelineFormPanelOpen}
      type={PanelType.custom}
      customWidth={customWidth}
      onDismiss={() => {
        dispatch(productSettingsActions.closeTimelineFormPanel());
      }}>
      <PanelTitle title={'Edit Timeline'} />
      <CommandBar
        styles={commandBarStyles}
        items={_items}
        className="dealers__store__controls"
      />
      <TimelineForm
        formikReference={formikReference}
        submitAction={(args: DeliveryTimeline) => {
          if (selectedDeliveryTimeline) {
            dispatch(productSettingsActions.apiUpdateDeliveryTimeline(args));
          } else {
            dispatch(productSettingsActions.apiCreateNewDeliveryTimeline(args));
          }
          dispatch(productSettingsActions.closeTimelineFormPanel());
        }}
        currentTimeline={
          selectedDeliveryTimeline ? selectedDeliveryTimeline : null
        }
      />
    </Panel>
  );
};

export default TimelinePanel;
