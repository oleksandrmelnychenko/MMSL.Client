import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productActions } from '../../redux/slices/product.slice';
import {
  Stack,
  ScrollablePane,
  ActionButton,
  IIconProps,
  Dropdown,
  Label,
  DropdownMenuItemType,
  ComboBox,
  IDropdownOption,
} from 'office-ui-fabric-react';

import { scrollablePaneStyleForDetailList } from '../../common/fabric-styles/styles';
import { IApplicationState } from '../../redux/reducers/index';
import { ProductCategory } from '../../interfaces';
import { useHistory } from 'react-router-dom';

export const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

const Measurements: React.FC = () => {
  const dispatch = useDispatch();

  const category = useSelector<IApplicationState, ProductCategory | null>(
    (state) => state.product.choose.category
  );

  useEffect(() => {
    return () => {};
  }, []);

  const addMeasurement = () => {};

  return (
    <div className="content__root">
      <div className="content__header">
        <div className="content__header__top">
          <Stack className="measurement">
            <div className="content__header__top__title">
              <Stack horizontal>
                <Label>Measurements</Label>

                <ActionButton
                  styles={{
                    root: {
                      height: '30px',
                      paddingLeft: '20px',
                    },
                  }}
                  onClick={addMeasurement}
                  iconProps={{ iconName: 'Add' }}
                >
                  Add measurement
                </ActionButton>

                <ComboBox
                  allowFreeform={true}
                  autoComplete={true ? 'on' : 'off'}
                  options={[
                    { key: 'A', text: 'Option A' },
                    { key: 'B', text: 'Option B' },
                    { key: 'C', text: 'Option C' },
                    { key: 'D', text: 'Option D' },
                  ]}
                />
              </Stack>
            </div>
          </Stack>
        </div>
      </div>
      <ScrollablePane styles={scrollablePaneStyleForDetailList}>
        {'Main content'}
      </ScrollablePane>
    </div>
  );
};

export default Measurements;
