import React from 'react';
import { productActions } from '../../../redux/slices/product.slice';
import {
  controlActions,
  IInfoPanelMenuItem,
} from '../../../redux/slices/control.slice';
import {
  rightPanelActions,
  RightPanelType,
} from '../../../redux/slices/rightPanel.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory } from '../../../interfaces/products';
import ProductManagementPanel from './ProductManagementPanel';
import ProductDeliverTimelineForm from '../delivery-timeline/ProductDeliverTimelineForm';
import { RoleType } from '../../../interfaces/identity';
import { renderMenuItem } from '../../master/DashboardLeftMenuPanel';

const ProductTimelinesPanel: React.FC = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const choseCategory = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  const menuItem: IInfoPanelMenuItem[] = [
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
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
      },
    },
    {
      allowedRoles: [RoleType.Administrator, RoleType.Manufacturer],
      title: 'New',
      className: choseCategory
        ? 'management__btn-new_measurement'
        : 'management__btn-new_measurement management__btn-disabled',
      isDisabled: choseCategory ? false : true,
      tooltip: 'Create new timeline',
      onClickFunc: () => {
        if (choseCategory) {
          dispatch(productActions.selectedTimeline(null));
          dispatch(
            rightPanelActions.openRightPanel({
              title: 'New timeline',
              width: '400px',
              panelType: RightPanelType.Form,
              closeFunctions: () => {
                dispatch(rightPanelActions.closeRightPanel());
              },
              component: ProductDeliverTimelineForm,
            })
          );
        }
      },
    },
  ];

  return <>{renderMenuItem(menuItem)}</>;
};

export default ProductTimelinesPanel;
