import React, { useEffect, useState } from 'react';
import {
  DetailsList,
  IColumn,
  Text,
  Selection,
  Image,
  Stack,
  IconButton,
  MarqueeSelection,
  DetailsHeader,
  DetailsRow,
  CheckboxVisibility,
  GroupHeader,
  ITextProps,
  IImageProps,
  ImageFit,
  ScrollablePane,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { OptionGroup } from '../../interfaces';
import { assignPendingActions } from '../../helpers/action.helper';
import * as productSettingsActions from '../../redux/actions/productSettings.actions';
import { ManagingPanelComponent } from '../../redux/reducers/productSettings.reducer';
import { List } from 'linq-typescript';
import { scrollablePaneStyleForDetailList } from '../../common/fabric-styles/styles';

const _columnIconButtonStyle = {
  root: {
    height: '20px',
  },
};

export const ProductSettingsList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection());

  const outionGroups: OptionGroup[] = useSelector<
    IApplicationState,
    OptionGroup[]
  >((state) => state.productSettings.optionGroupsList);

  useEffect(() => {
    dispatch(productSettingsActions.getAllOptionGroupsList());
  }, [dispatch]);

  const customerColumns: IColumn[] = [
    {
      key: 'index',
      name: '#',
      minWidth: 16,
      maxWidth: 24,
      onColumnClick: () => {},
      onRender: (item: any, index?: number) => {
        const imageProps: IImageProps = {
          src: item.imageUrl,
          imageFit: ImageFit.center,
          width: 67,
          height: 53,
        };

        return (
          <Stack horizontal tokens={{ childrenGap: 20 }}>
            {item.imageUrl && item.imageUrl.length > 0 ? (
              <Stack.Item>
                <Image {...imageProps} alt={`${item.value}`} />
              </Stack.Item>
            ) : null}

            <Stack>
              <Stack.Item>
                <Text
                  variant={'mediumPlus' as ITextProps['variant']}
                  styles={{ root: { color: '#484848', fontWeight: 400 } }}
                >
                  {item.value}
                </Text>
              </Stack.Item>
              <Stack.Item>
                <Text styles={{ root: { color: '#7b7b7b' } }}>
                  {item.isMandatory ? 'Allowed' : 'Not allowed'}
                </Text>
              </Stack.Item>
            </Stack>
          </Stack>
        );
      },
    },
  ];

  const allConcatedUnits = new List(outionGroups)
    .selectMany((group) => group.optionUnits)
    .toArray();

  let groupIndex: number = 0;
  const groups = new List(outionGroups)
    .select((group) => {
      const groupEntity = {
        key: `${group.id}`,
        name: group.name,
        level: 0,
        startIndex: groupIndex,
        count: group.optionUnits.length,
        isDropEnabled: group.optionUnits.length > 0,
      };

      groupIndex += group.optionUnits.length;

      return groupEntity;
    })
    .toArray();

  return (
    <div className="customerList">
      <ScrollablePane styles={scrollablePaneStyleForDetailList}>
        <DetailsList
          groupProps={{
            showEmptyGroups: true,
            onRenderHeader: (props?: any, defaultRender?: any) => {
              const headerCountStyle = { display: 'none' };
              const checkButtonStyle = { display: 'none' };

              return (
                <GroupHeader
                  onRenderTitle={(props?: any, defaultRender?: any) => {
                    return (
                      <div>
                        <Stack horizontal tokens={{ childrenGap: 20 }}>
                          {defaultRender(props)}
                          <IconButton
                            styles={_columnIconButtonStyle}
                            height={20}
                            iconProps={{ iconName: 'Edit' }}
                            title="Settings"
                            ariaLabel="Settings"
                            onClick={() => {
                              let action = assignPendingActions(
                                productSettingsActions.getAndSelectOptionGroupById(
                                  parseInt(props.group.key)
                                ),
                                [
                                  productSettingsActions.managingPanelContent(
                                    ManagingPanelComponent.ManageUnits
                                  ),
                                ]
                              );
                              dispatch(action);
                            }}
                          />
                        </Stack>
                      </div>
                    );
                  }}
                  styles={{
                    root: { overflowY: 'scroll' },
                    check: checkButtonStyle,
                    headerCount: headerCountStyle,
                  }}
                  {...props}
                />
              );
            },
          }}
          groups={groups}
          isHeaderVisible={false}
          columns={customerColumns}
          items={allConcatedUnits}
          checkboxVisibility={CheckboxVisibility.hidden}
          onRenderRow={(args: any) => {
            return (
              <div>
                <DetailsRow {...args} />
              </div>
            );
          }}
          onRenderDetailsHeader={(props: any, _defaultRender?: any) => {
            return (
              <DetailsHeader
                {...props}
                ariaLabelForToggleAllGroupsButton={'Expand collapse groups'}
              />
            );
          }}
        />
      </ScrollablePane>
    </div>
  );
};

export default ProductSettingsList;
