import React, { useEffect } from 'react';
import {
  Label,
  PrimaryButton,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';
import {
  controlActions,
  IInfoPanelMenuItem,
} from '../../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory } from '../../../interfaces/products';
import ProductManagementPanel, {
  PRODUCT_CATEGORIES_DASHBOARD_PATH,
} from './ProductManagementPanel';
import ProductPermissionForm from '../productPermissions/managing/ProductPermissionForm';

export const permissionsPanelDismisActions = () => {
  return [];
};

const ProductPermissionsPanel: React.FC = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const choseCategory = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  useEffect(() => {
    return () => {};
  }, []);

  const menuItem: IInfoPanelMenuItem[] = [
    {
      title: 'Back',
      className: 'management__btn-back_measurement',
      isDisabled: false,
      tooltip: 'Go back to products',
      onClickFunc: () => {
        history.push(PRODUCT_CATEGORIES_DASHBOARD_PATH);

        /// Open product managing (common) panel
        dispatch(
          controlActions.openInfoPanelWithComponent({
            component: ProductManagementPanel,
            onDismisPendingAction: () => {},
          })
        );

        permissionsPanelDismisActions().forEach((action) => {
          dispatch(action);
        });
      },
    },
    {
      title: 'New',
      className: choseCategory
        ? 'management__btn-style_add_permissions'
        : 'management__btn-style_add_permissions management__btn-disabled',
      isDisabled: choseCategory ? false : true,
      tooltip: 'Create new product style permission',
      onClickFunc: () => {
        if (choseCategory) {
          dispatch(
            controlActions.openRightPanel({
              title: 'New style permission',
              width: '400px',
              closeFunctions: () => {
                dispatch(controlActions.closeRightPanel());
              },
              component: ProductPermissionForm,
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
          id={`{${index}_timelineOptionPanel}`}
          calloutProps={{ gapSpace: 0 }}
          delay={TooltipDelay.zero}
          directionalHint={DirectionalHint.rightCenter}
          styles={{ root: { display: 'inline-block' } }}
          content={(item as any).tooltip}
        >
          <Label
            styles={labelStyle}
            disabled={item.isDisabled}
            className={false ? `selected` : ''}
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

export default ProductPermissionsPanel;
