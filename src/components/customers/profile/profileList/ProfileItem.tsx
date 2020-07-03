import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CustomerProductProfile } from '../../../../interfaces/orderProfile';
import { Stack, Text, FontIcon } from 'office-ui-fabric-react';
import { defaultCellStyle } from '../../../../common/fabric-styles/styles';
import './profileItem.scss';
import { orderProfileActions } from '../../../../redux/slices/customer/orderProfile/orderProfile.slice';
import { IApplicationState } from '../../../../redux/reducers';

export interface IProfileItemProps {
  profile: CustomerProductProfile;
}

export const ProfileItem: React.FC<IProfileItemProps> = (
  props: IProfileItemProps
) => {
  const dispatch = useDispatch();

  const { targetOrderProfile }: any = useSelector<IApplicationState, any>(
    (state) => state.orderProfile
  );

  return (
    <div
      className={
        props.profile.id === targetOrderProfile?.id
          ? 'profileItem selected'
          : 'profileItem'
      }
      onClick={() => {
        dispatch(orderProfileActions.changeTargetOrderProfile(props.profile));
      }}
    >
      <Stack>
        <Stack horizontal tokens={{ childrenGap: '6px' }}>
          <Stack.Item
            className={
              props.profile.id === targetOrderProfile?.id
                ? 'profileItem__selectIcon selected'
                : 'profileItem__selectIcon'
            }
          >
            <FontIcon
              style={{ cursor: 'default' }}
              iconName="SkypeCircleCheck"
              className={'profileItem__selectIcon__icon'}
            />
          </Stack.Item>
          <Stack.Item>
            <Text style={defaultCellStyle}>{props.profile.name}</Text>
          </Stack.Item>
        </Stack>
      </Stack>
    </div>
  );
};

export default ProfileItem;
