import React, { useEffect } from 'react';
import {
  Label,
  PrimaryButton,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import { controlActions } from '../../../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import {
  labelStyle,
  btnMenuStyle,
} from '../../../../common/fabric-styles/styles';
import { ProductManagingPanelComponent } from '../../../../redux/slices/product.slice';
import { useHistory } from 'react-router-dom';
import ProductManagementPanel, {
  IProductMenuItem,
} from '../ProductManagementPanel';
import { fittingTypesActions } from '../../../../redux/slices/measurements/fittingTypes.slice';
import {
  measurementViewControlsActions,
  ChartDisplayToMeasurementType,
} from '../../../../redux/slices/measurements/measurementViewControls.slice';
import { ProductCategory } from '../../../../interfaces/products';
import FittingTypeForm from '../../measurements/chartsGrid/bodyMeasurement/management/FittingTypeForm';
import { IApplicationState } from '../../../../redux/reducers';
import { Measurement } from '../../../../interfaces/measurements';

export const bodyMeasurementOptionsPanelDismisActions = () => {
  return [
    measurementViewControlsActions.changeChartDisplay(
      ChartDisplayToMeasurementType.Base
    ),
    fittingTypesActions.changeFittingTypes([]),
  ];
};

const BodyMeasurementOptions: React.FC = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const category = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  const targetProductMeasurement: Measurement | null | undefined = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.product.productMeasurementsState.targetMeasurement);

  const menuItem: IProductMenuItem[] = [
    {
      title: 'Back',
      className: 'management__btn-back_measurement',
      componentType: ProductManagingPanelComponent.Unknown,
      isDisabled: false,
      tooltip: 'Go back to products',
      onClickFunc: () => {
        history.push('/en/app/product/product-categories');
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductManagementPanel,
            onDismisPendingAction: () => {},
          })
        );

        bodyMeasurementOptionsPanelDismisActions().forEach((action) => {
          dispatch(action);
        });
      },
    } as IProductMenuItem,
    {
      title: 'New',
      className:
        category && targetProductMeasurement
          ? 'management__btn-new_measurement'
          : 'management__btn-new_measurement management__btn-disabled',
      componentType: ProductManagingPanelComponent.Unknown,
      isDisabled: category && targetProductMeasurement ? false : true,
      tooltip: 'Add fitting type',
      onClickFunc: () => {
        if (category && targetProductMeasurement) {
          dispatch(
            controlActions.openRightPanel({
              title: 'Add fitting type',
              width: '400px',
              closeFunctions: () => {
                dispatch(controlActions.closeRightPanel());
              },
              component: FittingTypeForm,
            })
          );
        }
      },
    } as IProductMenuItem,
  ];

  return (
    <div className="management">
      {menuItem.map((item, index) => (
        <TooltipHost
          key={index}
          id={`{${index}_measurementOptionPanel}`}
          calloutProps={{ gapSpace: 0 }}
          delay={TooltipDelay.zero}
          directionalHint={DirectionalHint.rightCenter}
          styles={{ root: { display: 'inline-block' } }}
          content={(item as any).tooltip}
        >
          <Label styles={labelStyle} className={false ? 'selected' : ''}>
            <PrimaryButton
              disabled={item.isDisabled}
              styles={btnMenuStyle}
              className={item.className}
              onClick={() => {
                item.onClickFunc();
              }}
              allowDisabledFocus
            />
            {item.title}
          </Label>
        </TooltipHost>
      ))}
    </div>
  );
};

export default BodyMeasurementOptions;
