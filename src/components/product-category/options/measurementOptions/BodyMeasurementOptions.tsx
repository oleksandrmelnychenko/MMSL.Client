import React from 'react';
import {
  controlActions,
  IInfoPanelMenuItem,
} from '../../../../redux/slices/control.slice';
import { rightPanelActions } from '../../../../redux/slices/rightPanel.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ProductManagementPanel from '../ProductManagementPanel';
import { fittingTypesActions } from '../../../../redux/slices/measurements/fittingTypes.slice';
import {
  measurementViewControlsActions,
  ChartDisplayToMeasurementType,
} from '../../../../redux/slices/measurements/measurementViewControls.slice';
import { ProductCategory } from '../../../../interfaces/products';
import FittingTypeForm from '../../measurements/chartsGrid/bodyMeasurement/management/FittingTypeForm';
import { IApplicationState } from '../../../../redux/reducers';
import { Measurement } from '../../../../interfaces/measurements';
import { RoleType } from '../../../../interfaces/identity';
import { renderMenuItem } from '../../../master/DashboardLeftMenuPanel';

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

  const menuItem: IInfoPanelMenuItem[] = [
    {
      allowedRoles: [
        RoleType.Administrator,
        RoleType.Manufacturer,
        RoleType.Dealer,
      ],
      title: 'Back',
      className: 'management__btn-back_measurement',
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
    },
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'New',
      className:
        category && targetProductMeasurement
          ? 'management__btn-new_measurement'
          : 'management__btn-new_measurement management__btn-disabled',
      isDisabled: category && targetProductMeasurement ? false : true,
      tooltip: 'Add fitting type',
      onClickFunc: () => {
        if (category && targetProductMeasurement) {
          dispatch(
            rightPanelActions.openRightPanel({
              title: 'Add fitting type',
              width: '400px',
              closeFunctions: () => {
                dispatch(rightPanelActions.closeRightPanel());
              },
              component: FittingTypeForm,
            })
          );
        }
      },
    },
  ];

  return <>{renderMenuItem(menuItem)}</>;
};

export default BodyMeasurementOptions;
