import React from 'react';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../../../redux/reducers/index';
import { List } from 'linq-typescript';
import BaseMeasurementOptions, {
  baseMeasurementOptionsPanelDismisActions,
} from './BaseMeasurementOptions';
import BodyMeasurementOptions, {
  bodyMeasurementOptionsPanelDismisActions,
} from './BodyMeasurementOptions';
import { ChartDisplayToMeasurementType } from '../../../../redux/slices/measurements/measurementViewControls.slice';

export const measurementsPanelDismisActions = () => {
  return new List(baseMeasurementOptionsPanelDismisActions())
    .concat(bodyMeasurementOptionsPanelDismisActions() as any[])
    .toArray();
};

const _renderOptions = (chartDisplayType: ChartDisplayToMeasurementType) => {
  let contentResult = null;

  if (chartDisplayType === ChartDisplayToMeasurementType.Base)
    contentResult = <BaseMeasurementOptions />;
  else if (chartDisplayType === ChartDisplayToMeasurementType.Body)
    contentResult = <BodyMeasurementOptions />;

  return contentResult;
};

const ProductMeasurementPanel: React.FC = () => {
  const chartDisplayType: ChartDisplayToMeasurementType = useSelector<
    IApplicationState,
    ChartDisplayToMeasurementType
  >((state) => state.measurementViewControls.chartDisplay);

  return <div className="management">{_renderOptions(chartDisplayType)}</div>;
};

export default ProductMeasurementPanel;
