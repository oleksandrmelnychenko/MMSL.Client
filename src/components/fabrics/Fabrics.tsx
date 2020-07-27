import React from 'react';
import { Stack, ScrollablePane, Separator } from 'office-ui-fabric-react';
import FabricsHeader from './header/FabricsHeader';
import FabricList from './FabricList';
import FabricFiltersBootstrapper from './filters/FabricFiltersBootstrapper';
import * as fabricStyles from '../../common/fabric-styles/styles';

const Fabrics: React.FC = () => {
  return (
    <div className="content__root">
      <Stack verticalAlign="space-around">
        <Stack.Item align="stretch">
          <div className="content__header">
            <div className="content__header__top">
              <FabricsHeader />
            </div>
          </div>
        </Stack.Item>

        <ScrollablePane
          styles={{
            ...fabricStyles.scrollablePaneStyleForDetailList,
            contentContainer: {
              overflowX: 'hidden',
              left: '0px',
              padding: '12px',
            },
          }}
        >
          <Stack horizontal>
            <Stack.Item>
              <ScrollablePane
                styles={{
                  contentContainer: {
                    overflowX: 'hidden',
                    left: '0',
                    padding: '12px',
                    width: '270px',
                  },
                }}
              >
                <FabricFiltersBootstrapper />
              </ScrollablePane>
            </Stack.Item>

            <Separator
              vertical
              styles={{
                root: {
                  position: 'absolute',
                  height: '100%',
                  top: '0px',
                  left: '274px',
                },
              }}
            />

            <Stack.Item>
              <ScrollablePane
                styles={{
                  root: { left: '281px' },
                  contentContainer: {
                    overflowX: 'hidden',
                    padding: '12px',
                  },
                }}
              >
                <FabricList />
              </ScrollablePane>
            </Stack.Item>
          </Stack>
        </ScrollablePane>
      </Stack>
    </div>
  );
};

export default Fabrics;
