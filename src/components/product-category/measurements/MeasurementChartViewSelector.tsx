import React from 'react';
import {
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  FontWeights,
} from 'office-ui-fabric-react';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import {
  ChartDisplayToMeasurementType,
  measurementViewControlsActions,
} from '../../../redux/slices/measurements/measurementViewControls.slice';
import './measurementChartViewSelector.scss';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';

const _buildChartViewOptions = (displayType: ChartDisplayToMeasurementType) => {
  return [
    {
      key: 'baseMeasurement',
      text: 'Base Measurement',
      isSelected: displayType === ChartDisplayToMeasurementType.Base,
      displayType: ChartDisplayToMeasurementType.Base,
    } as IDropdownOption,
    {
      key: 'bodyMeasurement',
      text: 'Body Measurement',
      isSelected: displayType === ChartDisplayToMeasurementType.Body,
      displayType: ChartDisplayToMeasurementType.Body,
    } as IDropdownOption,
  ];
};

const _dropdownStyles: Partial<IDropdownStyles> = {
  ...fabricStyles.comboBoxStyles,
  callout: { minWidth: '176px' },
  root: {
    marginTop: '-41px',
  },
  title: {
    border: '0px solid transparent',
    paddingLeft: '0px',
    fontWeight: FontWeights.bold,
  },
};

const MeasurementChartViewSelector: React.FC = () => {
  const dispatch = useDispatch();

  const chartDisplayType: ChartDisplayToMeasurementType = useSelector<
    IApplicationState,
    ChartDisplayToMeasurementType
  >((state) => state.measurementViewControls.chartDisplay);

  return (
    <>
      <Dropdown
        placeholder="Coose chart view"
        label="Chart View"
        options={_buildChartViewOptions(chartDisplayType)}
        styles={_dropdownStyles}
        onChange={(
          event: React.FormEvent<HTMLDivElement>,
          option?: IDropdownOption,
          index?: number
        ) => {
          if (option) {
            dispatch(
              measurementViewControlsActions.changeChartDisplay(
                (option as any).displayType
              )
            );
          }
        }}
      />
    </>
  );
};

export default MeasurementChartViewSelector;
