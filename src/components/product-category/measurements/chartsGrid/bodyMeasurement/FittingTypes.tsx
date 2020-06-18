import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fittingTypesActions } from '../../../../../redux/slices/measurements/fittingTypes.slice';

export const CREATE_YOUR_FIRST_fitting_type: string =
  'Create your first fitting type';
export const CREATE_fitting_type: string = 'Create fitting type';

const FittingTypes: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fittingTypesActions.apiGetFittingTypesByMeasurementId(1));
  }, []);

  return <div>{'Fitting types'}</div>;
};

export default FittingTypes;
