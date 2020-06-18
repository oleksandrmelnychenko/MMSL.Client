import React, { useEffect } from 'react';
import {
  Label,
  PrimaryButton,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import { controlActions } from '../../../../redux/slices/control.slice';
import { useDispatch } from 'react-redux';
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

  useEffect(() => {
    return () => {};
  }, []);

  const menuItem: IProductMenuItem[] = [
    {
      title: 'Back',
      className: 'management__btn-back_measurement',
      componentType: ProductManagingPanelComponent.ProductCategoryDetails,
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
