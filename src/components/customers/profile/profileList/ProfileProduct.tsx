import React, { useState } from 'react';
import {
  Stack,
  IconButton,
  Text,
  FontWeights,
  CommandBarButton,
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
import {
  orderProfileActions,
  MainProfileView,
} from '../../../../redux/slices/customer/orderProfile/orderProfile.slice';

export interface IProfileProductProps {
  expandableProfileProduct: ExpandableItem;
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
    marginBottom: '15px',
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

  const [isExpanded, setIsExpanded] = useState<boolean>();

  return (
    <div className={isExpanded ? 'profileProduct expanded' : 'profileProduct'}>
      <Stack tokens={{ childrenGap: 12 }}>
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
            onClick={() => setIsExpanded(!isExpanded)}
          />

          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Stack.Item align="end">
              <Text styles={_textStackStyle}>
                {props.expandableProfileProduct.item.name}
              </Text>
            </Stack.Item>
          </Stack>
        </Stack>

        {isExpanded ? (
          <Stack
            wrap={true}
            className="stack_option"
            horizontal
            tokens={{ childrenGap: 20 }}
          >
            {props.expandableProfileProduct.item.optionUnits &&
            props.expandableProfileProduct.item.customerProductProfiles.length >
              0 ? (
              props.expandableProfileProduct.item.customerProductProfiles.map(
                (profile: CustomerProductProfile, index: number) => (
                  <React.Fragment key={index}>
                    <ProfileItem profile={profile} />
                  </React.Fragment>
                )
              )
            ) : (
              <div style={{ marginLeft: '9px', marginTop: '-6px' }}>
                <Stack horizontal tokens={{ childrenGap: '12px' }}>
                  <Stack.Item styles={{ root: { marginTop: '5px' } }}>
                    {renderHintLable(`No profiles for this product.`)}
                  </Stack.Item>
                  <Stack.Item align="start">
                    <CommandBarButton
                      onClick={() => {
                        dispatch(
                          controlActions.openInfoPanelWithComponent({
                            component: ManageProfileOptiosPanel,
                            onDismisPendingAction: () => {
                              onDismissManageProfileOptiosPanel().forEach(
                                (action) => dispatch(action)
                              );
                            },
                          })
                        );
                        dispatch(
                          orderProfileActions.changeMainProfileView(
                            MainProfileView.CreatingNewProfile
                          )
                        );
                      }}
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
