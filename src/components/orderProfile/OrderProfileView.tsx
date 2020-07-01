import React, { useState, useEffect } from 'react';
import { Stack } from 'office-ui-fabric-react';
import OrderProfileHeader from './OrderProfileHeader';
import OrderProfileList from './OrderProfileList';
import '../dealers/dealers.scss';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { assignPendingActions } from '../../helpers/action.helper';
import { orderProfileActions } from '../../redux/slices/orderProfile/orderProfile.slice';
import { controlActions } from '../../redux/slices/control.slice';
import OrderProfileFormBootstrapper from './managing/orderProfile/OrderProfileFormBootstrapper';

export const CREATE_YOUR_FIRST_ORDER_PROFILE: string =
  'Create your first order profile';
export const CREATE_ORDER_PROFILE: string = 'Create order profile';

const OrderProfileView: React.FC = () => {
  const dispatch = useDispatch();

  const [isWasIntended, setIsWasIntended] = useState<boolean>(false);

  const isEmpty: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.orderProfile.orderProfiles.length === 0
  );

  useEffect(() => {
    dispatch(
      assignPendingActions(
        orderProfileActions.apiGetOrderProfiles(),
        [],
        [],
        (args: any) => {
          setIsWasIntended(true);
          dispatch(orderProfileActions.changeOrderProfiles(args));
        },
        (args: any) => {
          setIsWasIntended(true);
        }
      )
    );

    return () => {
      dispatch(orderProfileActions.changeOrderProfiles([]));
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
            title: CREATE_YOUR_FIRST_ORDER_PROFILE,
            buttonLabel: CREATE_ORDER_PROFILE,
            buttonAction: () => {
              dispatch(
                controlActions.openRightPanel({
                  title: 'New Order profile',
                  width: '700px',
                  closeFunctions: () => {
                    dispatch(controlActions.closeRightPanel());
                  },
                  component: OrderProfileFormBootstrapper,
                })
              );
            },
          })
        );
      } else {
        dispatch(controlActions.closeDashboardHintStub());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWasIntended, isEmpty]);

  return (
    <>
      {isWasIntended ? (
        <div className="content__root">
          <Stack verticalAlign="space-around">
            <Stack.Item align="stretch">
              <div className="content__header">
                <div className="content__header__top">
                  <OrderProfileHeader />
                </div>
              </div>
            </Stack.Item>
            <Stack.Item>
              <OrderProfileList />
            </Stack.Item>
          </Stack>
        </div>
      ) : null}
    </>
  );
};

export default OrderProfileView;
