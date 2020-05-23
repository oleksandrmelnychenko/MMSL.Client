import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as productCategoryAction from '../../../redux/actions/productCategory.actions';
import { Stack, ScrollablePane } from 'office-ui-fabric-react';

import { scrollablePaneStyleForDetailList } from '../../../common/fabric-styles/styles';

import MeasurementsList from './MeasurementsList';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

const Measurements: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="content__root">
      <div className="content__header">
        <div className="content__header__top">
          <Stack horizontal>
            <div className="content__header__top__title">Measurements</div>
            <div className="content__header__top__controls">
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <div className="content__header__top__controls__control"></div>
              </Stack>
            </div>
          </Stack>
        </div>
      </div>
      <ScrollablePane styles={scrollablePaneStyleForDetailList}>
        <MeasurementsList />
      </ScrollablePane>
    </div>
  );
};

export default Measurements;
