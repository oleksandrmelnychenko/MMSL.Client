import React from 'react';
import { useDispatch } from 'react-redux';
import { CustomerProductProfile } from '../../../../interfaces/orderProfile';

export interface IProfileItemProps {
  profile: CustomerProductProfile;
}

export const ProfileItem: React.FC<IProfileItemProps> = (
  props: IProfileItemProps
) => {
  const dispatch = useDispatch();

  return <div>{props.profile.name}</div>;
};

export default ProfileItem;
