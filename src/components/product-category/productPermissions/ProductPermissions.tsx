import React, { useState, useEffect } from 'react';
import { ProductCategory } from '../../../interfaces/products';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { controlActions } from '../../../redux/slices/control.slice';
import { rightPanelActions } from '../../../redux/slices/rightPanel.slice';
import { assignPendingActions } from '../../../helpers/action.helper';
import { productStylePermissionsActions } from '../../../redux/slices/productStylePermissions.slice';
import ProductPermissionForm from './managing/ProductPermissionForm';
import PermissionsList from './PermissionsList';
import { Stack, Text, Separator, ScrollablePane } from 'office-ui-fabric-react';
import {
  horizontalGapStackTokens,
  mainTitleContent,
  mainTitleHintContent,
  scrollablePaneStyleForDetailList,
} from '../../../common/fabric-styles/styles';

export const CREATE_YOUR_FIRST_STYLE_SETTINGS_PERMISSION: string =
  'Create your first style permission';
export const CREATE_STYLE_PERMISSION: string = 'Create style permission';

const ProductPermissions: React.FC = () => {
  const dispatch = useDispatch();

  const [localProduct, setLocalProduct] = useState<
    ProductCategory | null | undefined
  >(null);
  const [isWasInited, setIsWasInited] = useState<boolean>(false);

  const targetProduct = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  const isAnyPermissions: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.productStylePermissions.permissionSettings.length > 0
  );

  /// Dispose own state
  useEffect(() => {
    return () => {
      setLocalProduct(null);
      setIsWasInited(false);
      dispatch(controlActions.closeDashboardHintStub());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /// Listen to `global` product changes and update own local state
  useEffect(() => {
    if (targetProduct && targetProduct.id !== localProduct?.id)
      setLocalProduct(targetProduct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetProduct]);

  /// Get style permissions
  useEffect(() => {
    if (localProduct) {
      dispatch(
        assignPendingActions(
          productStylePermissionsActions.apiGetAllStylePermissionsByProductId(
            localProduct.id
          ),
          [],
          [],
          (args: any) => {
            setIsWasInited(true);
            dispatch(
              productStylePermissionsActions.updatePermissionSettingsList(args)
            );
          },
          (args: any) => {}
        )
      );
    } else {
      dispatch(productStylePermissionsActions.updatePermissionSettingsList([]));
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localProduct]);

  /// Resolve dashboard hint visibility
  useEffect(() => {
    if (isWasInited) {
      if (isAnyPermissions) {
        dispatch(controlActions.closeDashboardHintStub());
      } else {
        dispatch(
          controlActions.showDashboardHintStub({
            isVisible: true,
            title: CREATE_YOUR_FIRST_STYLE_SETTINGS_PERMISSION,
            isButtonAvailable: true,
            buttonLabel: CREATE_STYLE_PERMISSION,
            buttonAction: () => {
              if (localProduct) {
                dispatch(
                  rightPanelActions.openRightPanel({
                    title: 'New style permission',
                    width: '400px',
                    closeFunctions: () => {
                      dispatch(rightPanelActions.closeRightPanel());
                    },
                    component: ProductPermissionForm,
                  })
                );
              }
            },
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWasInited, isAnyPermissions]);

  return (
    <div className="productPermissions">
      <div className="content__root">
        <Stack verticalAlign="space-around">
          <Stack.Item align="stretch">
            <div className="content__header">
              <div className="content__header__top">
                <Stack horizontal tokens={horizontalGapStackTokens}>
                  <Stack horizontal tokens={{ childrenGap: '10px' }}>
                    <Text
                      variant="xLarge"
                      nowrap
                      block
                      styles={mainTitleContent}
                    >
                      Style Permissions
                    </Text>

                    <Separator vertical />

                    <Text variant="xLarge" styles={mainTitleHintContent}>
                      {targetProduct ? targetProduct.name : ''}
                    </Text>
                  </Stack>
                </Stack>
              </div>
            </div>
          </Stack.Item>
          <Stack.Item>
            <ScrollablePane styles={scrollablePaneStyleForDetailList}>
              <PermissionsList />
            </ScrollablePane>
          </Stack.Item>
        </Stack>
      </div>
    </div>
  );
};

export default ProductPermissions;
