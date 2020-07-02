import React, { useEffect, useState } from 'react';
import { Stack } from 'office-ui-fabric-react';
import ProfileHeader from './ProfileHeader';
import ProfileList from './profileList/ProfileList';
import { assignPendingActions } from '../../../helpers/action.helper';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { orderProfileActions } from '../../../redux/slices/customer/orderProfile/orderProfile.slice';
import { productActions } from '../../../redux/slices/product.slice';

export const Profiles: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [isProfilesWasRequested, setIsProfilesWasRequested] = useState<boolean>(
    false
  );

  const { selectedCustomer } = useSelector<IApplicationState, any>(
    (state) => state.customer.customerState
  );

  useEffect(() => {
    return () => {
      dispatch(orderProfileActions.changeCustomerProductProfiles([]));
      setIsProfilesWasRequested(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      dispatch(
        assignPendingActions(
          orderProfileActions.apiGetProductProfilesByCutomerId(
            selectedCustomer.id
          ),
          // productActions.apiGetAllProductCategories(),
          [],
          [],
          (args: any) => {
            dispatch(orderProfileActions.changeCustomerProductProfiles(args));
            setIsProfilesWasRequested(true);
          },
          (args: any) => {
            dispatch(orderProfileActions.changeCustomerProductProfiles([]));
            setIsProfilesWasRequested(true);
          }
        )
      );
    } else {
      setIsProfilesWasRequested(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomer]);

  return (
    <>
      {isProfilesWasRequested ? (
        <div className="content__root">
          <Stack verticalAlign="space-around">
            <Stack.Item align="stretch">
              <div className="content__header">
                <div className="content__header__top">
                  <ProfileHeader />
                </div>
              </div>
            </Stack.Item>
            <Stack.Item>
              <ProfileList />
            </Stack.Item>
          </Stack>
        </div>
      ) : null}
    </>
  );
};

export default Profiles;
