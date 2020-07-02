import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { profileManagingActions } from '../../../../../redux/slices/customer/orderProfile/profileManaging.slice';

export const ProfileFormBootstrapper: React.FC = () => {
  const dispatch = useDispatch();

  // const targetOrderProfile:
  //   | CustomerProductProfile
  //   | null
  //   | undefined = useSelector<
  //   IApplicationState,
  //   CustomerProductProfile | null | undefined
  // >((state) => state.orderProfile.targetOrderProfile);

  useEffect(() => {
    return () => {
      dispatch(profileManagingActions.stopManaging());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{'Bootstrapper'}</>;
};

export default ProfileFormBootstrapper;
