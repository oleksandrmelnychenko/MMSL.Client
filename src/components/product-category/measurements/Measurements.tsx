import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as productCategoryAction from '../../../redux/actions/productCategory.actions';
import {
  Stack,
  ScrollablePane,
  ActionButton,
  IIconProps,
} from 'office-ui-fabric-react';

import { scrollablePaneStyleForDetailList } from '../../../common/fabric-styles/styles';

import MeasurementsList from './MeasurementsList';
import { IApplicationState } from '../../../redux/reducers/index';
import { ProductCategory } from '../../../interfaces';
import { useHistory } from 'react-router-dom';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

const Measurements: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const category = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );
  const backIcon: IIconProps = { iconName: 'Back' };

  useEffect(() => {
    return () => {};
  }, []);

  const addMeasurement = () => {};

  return (
    <div className="content__root">
      <div className="content__header">
        <div className="content__header__top">
          <Stack>
            <div className="content__header__top_back">
              <ActionButton
                styles={{ root: { height: '30px' } }}
                iconProps={backIcon}
                text="Back to product categories"
                onClick={() => history.goBack()}
              />
            </div>
          </Stack>
          <Stack className="measurement">
            <div className="content__header__top__title">
              Measurements of category: {category ? category.name : null}
              <ActionButton
                styles={{
                  root: {
                    height: '30px',
                    paddingLeft: '20px',
                  },
                }}
                onClick={addMeasurement}
                iconProps={{ iconName: 'Add' }}>
                Add measurement
              </ActionButton>
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
