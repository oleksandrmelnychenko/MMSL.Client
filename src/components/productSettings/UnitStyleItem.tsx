import React, { useEffect } from 'react';
import './productSettingsLsit.scss';
import {
  Text,
  Image,
  ITextProps,
  FontIcon,
  mergeStyles,
  Icon,
  Stack,
} from 'office-ui-fabric-react';
import { OptionUnit } from '../../interfaces';
import { useDispatch, useSelector } from 'react-redux';
import {
  productSettingsActions,
  ManagingPanelComponent,
} from '../../redux/slices/productSettings.slice';
import {
  controlActions,
  CommonDialogType,
  DialogArgs,
} from '../../redux/slices/control.slice';
import { Card } from '@uifabric/react-cards';
import * as fabricStyles from '../../common/fabric-styles/styles';
import { assignPendingActions } from '../../helpers/action.helper';
import { IApplicationState } from '../../redux/reducers';
import { horizontalGapStackTokens } from '../../common/fabric-styles/styles';

export class UnitRowItemProps {
  constructor() {
    this.optionUnit = new OptionUnit();
    this.takeMarginWhenNoImage = false;
  }

  optionUnit: OptionUnit;
  takeMarginWhenNoImage?: boolean;
}

export const UnitRowItem: React.FC<UnitRowItemProps> = (
  props: UnitRowItemProps
) => {
  const dispatch = useDispatch();

  const singleOptionForEdit: OptionUnit | null | undefined = useSelector<
    IApplicationState,
    OptionUnit | null | undefined
  >((state) => state.productSettings.manageSingleOptionUnitState.optionUnit);

  useEffect(() => {
    const panelContentType = singleOptionForEdit
      ? ManagingPanelComponent.ManageSingleOptionUnit
      : null;

    dispatch(productSettingsActions.managingPanelContent(panelContentType));
  }, [singleOptionForEdit, dispatch]);

  let allowColor = props.optionUnit.isMandatory ? '#2b579a' : '#2b579a60';

  let infoStyle: any = {};

  if (props.takeMarginWhenNoImage === true) {
    if (props.optionUnit.imageUrl) {
      if (props.optionUnit.imageUrl.length < 1) {
        infoStyle = { root: { position: 'relative', left: '88px' } };
      }
    } else {
      infoStyle = { root: { position: 'relative', left: '88px' } };
    }
  }

  return (
    <div className="card" style={{ position: 'relative' }}>
      <Card
        styles={fabricStyles.cardStyle}
        onClick={(args: any) => {}}
        tokens={fabricStyles.cardTokens}>
        <Card.Section fill verticalAlign="end">
          <Image
            src={props.optionUnit.imageUrl}
            styles={fabricStyles.marginImageCenter}></Image>
        </Card.Section>
        <Card.Section>
          <Stack horizontal>
            <Icon
              iconName="Unlock"
              className={mergeStyles({
                fontSize: 16,
                paddingRight: '5px',
                color: allowColor,
                cursor: 'default',
                display: 'inline-block',
              })}
            />
            <Text
              block
              nowrap
              variant="mediumPlus"
              styles={{
                root: { color: '#484848', fontWeight: 400, width: '120px' },
              }}>
              {props.optionUnit.value}
            </Text>
          </Stack>
        </Card.Section>
        <Card.Section
          className="card_actions"
          horizontal
          styles={fabricStyles.footerCardSectionStyles}
          tokens={fabricStyles.footerCardSectionTokens}>
          <Icon
            data-selection-disabled={true}
            styles={fabricStyles.editCardIcon}
            iconName="Edit"
            title="Edit"
            onClick={() => {
              dispatch(
                productSettingsActions.getAndSelectOptionUnitForSingleEditById(
                  props.optionUnit.id
                )
              );
            }}
          />
          <Icon
            data-selection-disabled={true}
            styles={fabricStyles.deleteIconRedColor}
            iconName="Delete"
            title="Delete"
            onClick={(args: any) => {
              dispatch(
                controlActions.toggleCommonDialogVisibility(
                  new DialogArgs(
                    CommonDialogType.Delete,
                    'Delete option unit',
                    `Are you sure you want to delete ${props.optionUnit.value}?`,
                    () => {
                      let action = assignPendingActions(
                        productSettingsActions.deleteOptionUnitById(
                          props.optionUnit.id
                        ),
                        [],
                        [],
                        (args: any) => {
                          let action = assignPendingActions(
                            productSettingsActions.getAllOptionGroupsList(),
                            [],
                            [],
                            (args: any) => {
                              dispatch(
                                productSettingsActions.updateOptionGroupList(
                                  args
                                )
                              );
                            }
                          );
                          dispatch(action);
                        }
                      );
                      dispatch(action);
                    },
                    () => {}
                  )
                )
              );
            }}
          />
        </Card.Section>
      </Card>
    </div>
  );
};

export default UnitRowItem;
