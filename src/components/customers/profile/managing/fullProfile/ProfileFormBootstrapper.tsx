import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  orderProfileActions,
  MainProfileViewStatus,
} from '../../../../../redux/slices/customer/orderProfile/orderProfile.slice';

export const ProfileFormBootstrapper: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(
        orderProfileActions.changeMainProfileView(
          MainProfileViewStatus.ExploreProfileList
        )
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{'Bootstrapper'}</>;
};

export default ProfileFormBootstrapper;
