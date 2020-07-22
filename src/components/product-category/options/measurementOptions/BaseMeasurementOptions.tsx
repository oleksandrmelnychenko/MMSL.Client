import React, { useEffect } from 'react';
import {
  Label,
  PrimaryButton,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import { productActions } from '../../../../redux/slices/product.slice';
import {
  controlActions,
  CommonDialogType,
  IInfoPanelMenuItem,
} from '../../../../redux/slices/control.slice';
import { rightPanelActions } from '../../../../redux/slices/rightPanel.slice';
import { useDispatch, useSelector } from 'react-redux';
import {
  labelStyle,
  btnMenuStyle,
} from '../../../../common/fabric-styles/styles';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../../redux/reducers/index';
import { Measurement } from '../../../../interfaces/measurements';
import { ProductCategory } from '../../../../interfaces/products';
import ProductManagementPanel from '../ProductManagementPanel';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { measurementActions } from '../../../../redux/slices/measurements/measurement.slice';
import { List } from 'linq-typescript';
import MeasurementForm from '../../measurements/chartsGrid/baseMeasurement/management/MeasurementForm';
import SizesForm from '../../measurements/chartsGrid/baseMeasurement/management/SizesForm';
import {
  measurementViewControlsActions,
  ChartDisplayToMeasurementType,
} from '../../../../redux/slices/measurements/measurementViewControls.slice';
import { RoleType } from '../../../../interfaces/identity';

export const baseMeasurementOptionsPanelDismisActions = () => {
  return [
    measurementViewControlsActions.changeChartDisplay(
      ChartDisplayToMeasurementType.Base
    ),
    productActions.changeSelectedProductMeasurement(null),
    productActions.updateProductMeasurementsList([]),
  ];
};

const BaseMeasurementOptions: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const choseCategory = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  const targetProductMeasurement: Measurement | null | undefined = useSelector<
    IApplicationState,
    Measurement | null | undefined
  >((state) => state.product.productMeasurementsState.targetMeasurement);

  const measurements: Measurement[] = useSelector<
    IApplicationState,
    Measurement[]
  >((state) => state.product.productMeasurementsState.measurementList);

  useEffect(() => {
    return () => {};
  }, []);

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

        baseMeasurementOptionsPanelDismisActions().forEach((action) => {
          dispatch(action);
        });
      },
    },
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'New',
      className: choseCategory
        ? 'management__btn-new_measurement'
        : 'management__btn-new_measurement management__btn-disabled',
      isDisabled: choseCategory ? false : true,
      tooltip: 'Create new measurement',
      onClickFunc: () => {
        if (choseCategory) {
          dispatch(
            rightPanelActions.openRightPanel({
              title: 'New Measurement',
              width: '400px',
              closeFunctions: () => {
                dispatch(rightPanelActions.closeRightPanel());
              },
              component: MeasurementForm,
            })
          );
        }
      },
    },
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'Edit',
      className:
        choseCategory && targetProductMeasurement
          ? 'management__btn-edit_measurement'
          : 'management__btn-edit_measurement management__btn-disabled',
      isDisabled: choseCategory && targetProductMeasurement ? false : true,
      tooltip: 'Edit measurement',
      onClickFunc: () => {
        if (targetProductMeasurement) {
          dispatch(
            productActions.changeProductMeasurementForEdit(
              targetProductMeasurement
            )
          );
          dispatch(
            rightPanelActions.openRightPanel({
              title: 'Edit Measurement',
              description: targetProductMeasurement.name,
              width: '400px',
              closeFunctions: () => {
                dispatch(rightPanelActions.closeRightPanel());
                dispatch(productActions.changeProductMeasurementForEdit(null));
              },
              component: MeasurementForm,
            })
          );
        }
      },
    },
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'Delete',
      className:
        choseCategory && targetProductMeasurement
          ? 'management__btn-delete_measurement'
          : 'management__btn-delete_measurement management__btn-disabled',
      isDisabled: choseCategory && targetProductMeasurement ? false : true,
      tooltip: 'Delete measurement',
      onClickFunc: () => {
        if (targetProductMeasurement) {
          dispatch(
            controlActions.toggleCommonDialogVisibility({
              dialogType: CommonDialogType.Delete,
              title: 'Delete measurement',
              subText: `Are you sure you want to delete ${targetProductMeasurement.name}?`,
              onSubmitClick: () => {
                dispatch(
                  /// Delete measurement
                  assignPendingActions(
                    measurementActions.apiDeleteMeasurementById(
                      targetProductMeasurement.id
                    ),
                    [],
                    [],
                    (args: any) => {
                      dispatch(
                        /// Clear target delete measurement
                        productActions.changeSelectedProductMeasurement(null)
                      );
                      const updatedMeasurements = new List(measurements)
                        .where((item) => item.id !== args.body)
                        .toArray();

                      dispatch(
                        productActions.updateProductMeasurementsList(
                          updatedMeasurements
                        )
                      );

                      if (updatedMeasurements.length > 0) {
                        dispatch(
                          /// Select first measurement
                          assignPendingActions(
                            measurementActions.apiGetMeasurementById(
                              updatedMeasurements[0].id
                            ),
                            [],
                            [],
                            (args: any) => {
                              dispatch(
                                productActions.changeSelectedProductMeasurement(
                                  args
                                )
                              );
                            },
                            (args: any) => {}
                          )
                        );
                      }
                    }
                  )
                );
              },
              onDeclineClick: () => {},
            })
          );
        }
      },
    },
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'New size',
      className:
        choseCategory && targetProductMeasurement
          ? 'management__btn-new_size_measurement'
          : 'management__btn-new_size_measurement management__btn-disabled',
      isDisabled: choseCategory && targetProductMeasurement ? false : true,
      tooltip: 'Add new measurement size',
      onClickFunc: () => {
        if (targetProductMeasurement) {
          dispatch(
            rightPanelActions.openRightPanel({
              title: 'Add size',
              description: targetProductMeasurement.name,
              width: '400px',
              closeFunctions: () => {
                dispatch(rightPanelActions.closeRightPanel());
              },
              component: SizesForm,
            })
          );
        }
      },
    },
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

export default BaseMeasurementOptions;
