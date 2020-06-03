import React, { useEffect } from 'react';
import {
  Label,
  PrimaryButton,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import { productActions } from '../../../redux/slices/product.slice';
import {
  controlActions,
  DialogArgs,
  CommonDialogType,
} from '../../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { ProductManagingPanelComponent } from '../../../redux/slices/product.slice';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory, Measurement } from '../../../interfaces';
import ProductManagementPanel, {
  IProductMenuItem,
} from './ProductManagementPanel';
import MeasurementForm from '../measurements/management/MeasurementForm';
import { assignPendingActions } from '../../../helpers/action.helper';
import { measurementActions } from '../../../redux/slices/measurement.slice';
import { List } from 'linq-typescript';
import SizesForm from '../measurements/management/SizesForm';

const ProductTimelinesPanel: React.FC = () => {
  const dispatch = useDispatch();
  let history = useHistory();

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

  const menuItem: IProductMenuItem[] = [
    {
      title: 'Back',
      className: 'management__btn-back_measurement',
      componentType: ProductManagingPanelComponent.ProductCategoryDetails,
      isDisabled: choseCategory ? false : true,
      tooltip: 'Go back to products',
      onClickFunc: () => {
        history.push('/en/app/product/product-categories');
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductManagementPanel,
            onDismisPendingAction: () => {},
          })
        );
      },
    } as IProductMenuItem,
    {
      title: 'New',
      className: 'management__btn-new_measurement',
      componentType: ProductManagingPanelComponent.ProductMeasurement,
      isDisabled: choseCategory ? false : true,
      tooltip: 'Create new measurement',
      onClickFunc: () => {
        dispatch(
          controlActions.openRightPanel({
            title: 'New Measurement',
            width: '400px',
            closeFunctions: () => {
              dispatch(controlActions.closeRightPanel());
            },
            component: MeasurementForm,
          })
        );
      },
    } as IProductMenuItem,
    {
      title: 'Edit',
      className: 'management__btn-edit_measurement',
      componentType: ProductManagingPanelComponent.ProductTimeLine,
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
            controlActions.openRightPanel({
              title: 'Edit Measurement',
              description: targetProductMeasurement.name,
              width: '400px',
              closeFunctions: () => {
                dispatch(controlActions.closeRightPanel());
                dispatch(productActions.changeProductMeasurementForEdit(null));
              },
              component: MeasurementForm,
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
          id={`{${index}_measurementOptionPanel}`}
          calloutProps={{ gapSpace: 0 }}
          delay={TooltipDelay.zero}
          directionalHint={DirectionalHint.rightCenter}
          styles={{ root: { display: 'inline-block' } }}
          content={(item as any).tooltip}
        >
          <Label
            key={index}
            styles={labelStyle}
            className={false ? 'selected' : ''}
          >
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

export default ProductTimelinesPanel;
