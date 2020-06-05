import React, { useState, useEffect } from 'react';
import { ProductCategory } from '../../../interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { controlActions } from '../../../redux/slices/control.slice';
import { assignPendingActions } from '../../../helpers/action.helper';
import { productStylePermissionsActions } from '../../../redux/slices/productStylePermissions.slice';

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
  }, []);

  /// Listen to `global` product changes and update own local state
  useEffect(() => {
    if (targetProduct && targetProduct.id !== localProduct?.id)
      setLocalProduct(targetProduct);
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
            buttonLabel: CREATE_STYLE_PERMISSION,
            buttonAction: () => {
              //   dispatch(
              //     controlActions.openRightPanel({
              //       title: 'New style permission',
              //       width: '400px',
              //       closeFunctions: () => {
              //         dispatch(controlActions.closeRightPanel());
              //       },
              //       component: MeasurementForm,
              //     })
              //   );
            },
          })
        );
      }
    }
  }, [isWasInited, isAnyPermissions]);

  return <div className="productPermissions">Product permissions</div>;
};

export default ProductPermissions;
