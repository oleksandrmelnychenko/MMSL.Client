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
  IInfoPanelMenuItem,
} from '../../../redux/slices/control.slice';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { useHistory } from 'react-router-dom';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory } from '../../../interfaces/products';
import ProductManagementPanel from './ProductManagementPanel';
import ProductDeliverTimelineForm from '../delivery-timeline/ProductDeliverTimelineForm';

const ProductTimelinesPanel: React.FC = () => {
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
            controlActions.openRightPanel({
              title: 'New timeline',
              width: '400px',
              closeFunctions: () => {
                dispatch(controlActions.closeRightPanel());
              },
              component: ProductDeliverTimelineForm,
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

export default ProductTimelinesPanel;
