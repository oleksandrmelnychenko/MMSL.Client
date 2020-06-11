import './productSettings.scss';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductSettingsManagementPanel from './productSettingManagement/ProductSettingsManagementPanel';
import {
  productSettingsActions,
  ManagingPanelComponent,
} from '../../../redux/slices/productSettings.slice';
import { IApplicationState } from '../../../redux/reducers';
import { ProductCategory } from '../../../interfaces/products';
import { assignPendingActions } from '../../../helpers/action.helper';
import { controlActions } from '../../../redux/slices/control.slice';
import ProductSettings from './ProductSettings';

export const CREATE_YOUR_FIRST_STYLE: string = 'Create your first style';
export const CREATE_STYLE: string = 'Create style';
export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

export const ProductSettingsBootstrapper: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [isWasIntended, setIsWasIntended] = useState<boolean>(false);

  const isEmpty: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.productSettings.optionGroupsList.length === 0
  );

  const targetProduct: ProductCategory | null = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const searchWord: string = useSelector<IApplicationState, string>(
    (state) => state.productSettings.searchWordOptionGroup
  );

  /// Dispose own state
  useEffect(() => {
    return () => {
      dispatch(productSettingsActions.updateOptionGroupList([]));
      dispatch(controlActions.closeDashboardHintStub());
      setIsWasIntended(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /// Resolve dashboard hint visibility
  useEffect(() => {
    if (isWasIntended) {
      if (isEmpty) {
        dispatch(
          controlActions.showDashboardHintStub({
            isVisible: true,
            title: CREATE_YOUR_FIRST_STYLE,
            buttonLabel: CREATE_STYLE,
            buttonAction: () => {
              /// TODO: use new pattern
              if (targetProduct) {
                dispatch(
                  productSettingsActions.managingPanelContent(
                    ManagingPanelComponent.ManageGroups
                  )
                );
              }
            },
          })
        );
      } else {
        dispatch(controlActions.closeDashboardHintStub());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWasIntended, isEmpty]);

  useEffect(() => {
    if (targetProduct?.id)
      dispatch(
        productSettingsActions.apiSearchOptionGroupsByProductIdList(
          targetProduct.id
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWord, dispatch]);

  useEffect(() => {
    if (targetProduct?.id) {
      dispatch(
        assignPendingActions(
          productSettingsActions.apiGetAllOptionGroupsByProductIdList(
            targetProduct.id
          ),
          [],
          [],
          (args: any) => {
            setIsWasIntended(true);
            dispatch(productSettingsActions.updateOptionGroupList(args));
          },
          (args: any) => {
            setIsWasIntended(true);
          }
        )
      );
    } else {
      dispatch(productSettingsActions.updateOptionGroupList([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetProduct]);

  return (
    <>
      {isWasIntended ? (
        <>
          <ProductSettings />
          {/* TODO: use new pattern */}
          <ProductSettingsManagementPanel />
        </>
      ) : null}
    </>
  );
};

export default ProductSettingsBootstrapper;
