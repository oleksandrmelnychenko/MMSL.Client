import React, { useState, useEffect } from 'react';
import FabricFilters from './FabricFilters';
import { FilterItem } from '../../../interfaces/fabric';
import { useSelector, useDispatch } from 'react-redux';
import { assignPendingActions } from '../../../helpers/action.helper';
import { IApplicationState } from '../../../redux/reducers';
import { fabricFiltersActions } from '../../../redux/slices/store/fabric/fabricFilters.slice';

const FabricFiltersBootstrapper: React.FC = () => {
  const dispatch = useDispatch();

  const [isWasIntended, setIsWasIntended] = useState<boolean>(false);

  const filters: FilterItem[] = useSelector<IApplicationState, FilterItem[]>(
    (state) => state.fabricFilters.filters
  );

  useEffect(() => {
    dispatch(
      assignPendingActions(
        fabricFiltersActions.apiGetFilters(),
        [],
        [],
        (args: any) => {
          setIsWasIntended(true);
          dispatch(fabricFiltersActions.changeFilters(args));
        },
        (args: any) => {
          setIsWasIntended(true);
        }
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <FabricFilters />
    </div>
  );
};

export default FabricFiltersBootstrapper;
