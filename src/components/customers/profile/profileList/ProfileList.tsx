import React, { useState } from 'react';
import {
  Text,
  ScrollablePane,
  DetailsList,
  IRenderFunction,
  IDetailsHeaderProps,
  TooltipHost,
  IDetailsColumnRenderTooltipProps,
  StickyPositionType,
  Sticky,
  Selection,
  CheckboxVisibility,
  SelectionMode,
  IColumn,
  DetailsRow,
} from 'office-ui-fabric-react';
import { IApplicationState } from '../../../../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { ProductCategory } from '../../../../interfaces/products';
import {
  scrollablePaneStyleForDetailList,
  detailsListStyle,
  defaultCellStyle,
} from '../../../../common/fabric-styles/styles';
import { CustomerProductProfile } from '../../../../interfaces/orderProfile';
import './profileList.scss';
import { orderProfileActions } from '../../../../redux/slices/customer/orderProfile/orderProfile.slice';

const _columns: IColumn[] = [
  {
    key: 'index',
    name: '',
    minWidth: 16,
    maxWidth: 24,
    onColumnClick: () => {},
    onRender: (item: any, index?: number) => {
      return (
        <Text style={defaultCellStyle} styles={{ root: { marginLeft: '0px' } }}>
          {index !== null && index !== undefined ? index + 1 : -1}
        </Text>
      );
    },
  },
  {
    key: 'name',
    name: 'Name',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    onRender: (item: any) => {
      return <Text style={defaultCellStyle}>{item.name}</Text>;
    },
    isPadded: true,
  },
];

const _onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
  props,
  defaultRender
) => {
  if (!props) {
    return null;
  }
  const onRenderColumnHeaderTooltip: IRenderFunction<IDetailsColumnRenderTooltipProps> = (
    tooltipHostProps
  ) => (
    <div className="list__header">
      <TooltipHost {...tooltipHostProps} />
    </div>
  );
  return (
    <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
      {defaultRender!({
        ...props,
        onRenderColumnHeaderTooltip,
      })}
    </Sticky>
  );
};

export const ProfileList: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection());

  const selectedProductProfile:
    | ProductCategory
    | null
    | undefined = useSelector<
    IApplicationState,
    ProductCategory | null | undefined
  >((state) => state.orderProfile.selectedProductProfiles);

  let profiles: CustomerProductProfile[] = selectedProductProfile
    ? selectedProductProfile.customerProductProfiles
    : [];

  return (
    <>
      {profiles.length > 0 ? (
        <div className="profileList">
          <ScrollablePane
            styles={{
              ...scrollablePaneStyleForDetailList,
              root: { ...scrollablePaneStyleForDetailList.root, top: '140px' },
            }}
          >
            <DetailsList
              onRenderDetailsHeader={_onRenderDetailsHeader}
              styles={detailsListStyle}
              items={profiles}
              checkboxVisibility={CheckboxVisibility.onHover}
              selection={selection}
              selectionPreservedOnEmptyClick
              selectionMode={SelectionMode.single}
              columns={_columns}
              onRenderRow={(args: any) => {
                return (
                  <div
                    onClick={(clickArgs: any) => {
                      if (
                        args?.item?.id &&
                        args.item.id !== selectedProductProfile?.id
                      ) {
                        dispatch(
                          orderProfileActions.changeTargetOrderProfile(
                            args.item
                          )
                        );
                      }
                    }}
                  >
                    <DetailsRow {...args} />
                  </div>
                );
              }}
            />
          </ScrollablePane>
        </div>
      ) : null}
    </>
  );
};

export default ProfileList;
