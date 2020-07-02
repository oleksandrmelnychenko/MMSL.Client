import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignPendingActions } from '../../../../../helpers/action.helper';
import { productActions } from '../../../../../redux/slices/product.slice';
import { Measurement } from '../../../../../interfaces/measurements';
import { CustomerProductProfile } from '../../../../../interfaces/orderProfile';
import { IApplicationState } from '../../../../../redux/reducers';

export const ProfileForm: React.FC = () => {
  const dispatch = useDispatch();

  return <>{'ProfileForm'}</>;
};

export default ProfileForm;
