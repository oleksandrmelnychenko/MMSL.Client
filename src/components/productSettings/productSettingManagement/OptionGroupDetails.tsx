import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as productSettingsActions from '../../../redux/actions/productSettings.actions';
import OptionItemsOrderingList from './OptionItemsOrderingList';

export const OptionGroupDetails: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productSettingsActions.getAllOptionGroupsList());
  }, [dispatch]);

  return (
    <div className="customerList">
      <OptionItemsOrderingList />
    </div>
  );
};

export default OptionGroupDetails;
