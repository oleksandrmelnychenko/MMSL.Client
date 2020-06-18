import React from 'react';
import {
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  FontWeights,
} from 'office-ui-fabric-react';
import * as fabricStyles from '../../../common/fabric-styles/styles';
import './measurementChartViewSelector.scss';

const _chartViewOptions: IDropdownOption[] = [
  {
    isSelected: true,
    key: 'baseShirtMeasurement',
    text: 'Base Shirt Measurement',
  },
  { key: 'bodyMeasurement', text: 'Body Measurement' },
];

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
  return (
    <>
      <Dropdown
        placeholder="Coose chart view"
        label="Chart View"
        options={_chartViewOptions}
        styles={_dropdownStyles}
      />
    </>
  );
};

export default MeasurementChartViewSelector;
