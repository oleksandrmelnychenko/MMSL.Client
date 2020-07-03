import React, { useState } from 'react';
import {
  Stack,
  IconButton,
  Text,
  FontWeights,
  CommandBarButton,
  Separator,
  TooltipHost,
  DirectionalHint,
} from 'office-ui-fabric-react';
import './profileProduct.scss';
import { ExpandableItem } from '../../../../interfaces';
import { CustomerProductProfile } from '../../../../interfaces/orderProfile';
import { renderHintLable } from '../../../../helpers/uiComponent.helper';
import ProfileItem from './ProfileItem';
import { controlActions } from '../../../../redux/slices/control.slice';
import { useDispatch } from 'react-redux';
import ManageProfileOptiosPanel, {
  onDismissManageProfileOptiosPanel,
} from '../../options/ManageProfileOptiosPanel';
import { StoreCustomer } from '../../../../interfaces/storeCustomer';
import { profileManagingActions } from '../../../../redux/slices/customer/orderProfile/profileManaging.slice';
import { List } from 'linq-typescript';
import { orderProfileActions } from '../../../../redux/slices/customer/orderProfile/orderProfile.slice';

export interface IProfileProductProps {
  expandableProfileProduct: ExpandableItem;
  customer: StoreCustomer;
}

const _addFirstSizeButtonStyle = {
  root: {
    height: '35px',
    // background: '#f0f0f0',
    borderRadius: '2px',
    padding: '0 12px',
  },
  label: {
    fontWeight: FontWeights.regular,
  },
  rootHovered: {
    // background: '#e5e5e5',
  },
};

const _groupContainerStyle = {
  root: {
    height: '40px',
    borderBottom: '1px solid rgb(243, 242, 241)',
    borderTop: '1px solid rgb(243, 242, 241)',
    marginBottom: '0px',
    marginTop: '15px',
  },
};

const _textStackStyle = {
  root: {
    fontSize: '15px',
    fontWeight: FontWeights.semibold,
  },
};

export const ProfileProduct: React.FC<IProfileProductProps> = (
  props: IProfileProductProps
) => {
  const dispatch = useDispatch();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (props.expandableProfileProduct.isExpanded !== isExpanded)
    setIsExpanded(props.expandableProfileProduct.isExpanded);

  const onCreateNewProfile = () => {
    dispatch(orderProfileActions.changeTargetOrderProfile(null));

    dispatch(
      controlActions.openInfoPanelWithComponent({
        component: ManageProfileOptiosPanel,
        onDismisPendingAction: () => {
          onDismissManageProfileOptiosPanel().forEach((action) =>
            dispatch(action)
          );
        },
      })
    );

    dispatch(
      profileManagingActions.beginManaging({
        customer: props.customer,
        productId: props.expandableProfileProduct.item.id,
        profileForEdit: null,
      })
    );
  };

  let profiles: CustomerProductProfile[] = [];

  if (props.expandableProfileProduct.item.customerProductProfiles) {
    profiles = new List<CustomerProductProfile>(
      props.expandableProfileProduct.item.customerProductProfiles
    )
      .where((item) => item !== null && item !== undefined)
      .toArray();
  }

  return (
    <div className={isExpanded ? 'profileProduct expanded' : 'profileProduct'}>
      <Stack tokens={{ childrenGap: 0 }}>
        <Stack
          horizontal
          verticalAlign="center"
          tokens={{ childrenGap: 12 }}
          styles={_groupContainerStyle}
        >
          <IconButton
            iconProps={{
              iconName: isExpanded ? 'ChevronDownMed' : 'ChevronRightMed',
            }}
            onClick={() => {
              props.expandableProfileProduct.isExpanded = !isExpanded;
              setIsExpanded(!isExpanded);
            }}
          />

          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Stack.Item align="end">
              <Text styles={_textStackStyle}>
                {props.expandableProfileProduct.item.name}
              </Text>
            </Stack.Item>
          </Stack>

          <Separator vertical styles={{ root: { height: '26px' } }} />

          <Stack horizontal tokens={{ childrenGap: 0 }}>
            <TooltipHost
              content="Add profile"
              directionalHint={DirectionalHint.bottomRightEdge}
              id="AddProfile"
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <IconButton
                iconProps={{ iconName: 'BoxAdditionSolid' }}
                onClick={() => onCreateNewProfile()}
              />
            </TooltipHost>
          </Stack>
        </Stack>

        {isExpanded ? (
          <Stack wrap={true} tokens={{ childrenGap: 0 }}>
            {profiles && profiles.length > 0 ? (
              profiles.map((profile: CustomerProductProfile, index: number) => {
                let result = null;

                if (profile) {
                  result = (
                    <React.Fragment key={index}>
                      <ProfileItem profile={profile} />
                    </React.Fragment>
                  );
                }

                return result;
              })
            ) : (
              <div style={{ marginLeft: '9px', marginTop: '6px' }}>
                <Stack horizontal tokens={{ childrenGap: '12px' }}>
                  <Stack.Item styles={{ root: { marginTop: '5px' } }}>
                    {renderHintLable(`No profiles for this product.`)}
                  </Stack.Item>
                  <Stack.Item align="start">
                    <CommandBarButton
                      onClick={() => onCreateNewProfile()}
                      height={20}
                      styles={_addFirstSizeButtonStyle}
                      iconProps={{ iconName: 'Add' }}
                      text="Add first profile"
                    />
                  </Stack.Item>
                </Stack>
              </div>
            )}
          </Stack>
        ) : null}
      </Stack>
    </div>
  );
};

export default ProfileProduct;
