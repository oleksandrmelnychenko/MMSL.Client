import React, { useEffect } from 'react';
import Stack from 'office-ui-fabric-react/lib/components/Stack/Stack';
import {
  FocusZone,
  FocusZoneDirection,
  Separator,
  Label,
  FontIcon,
  mergeStyles,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import { ProductCategory, OptionGroup } from '../../../interfaces';
import { List } from 'linq-typescript';
import * as productSettingsActions from '../../../redux/actions/productSettings.actions';
import { assignPendingActions } from '../../../helpers/action.helper';

class ProductCategoryDetailsProps {}

export const ProductCategoryDetails: React.FC<ProductCategoryDetailsProps> = (
  props: ProductCategoryDetailsProps
) => {
  const dispatch = useDispatch();

  const targetProductCategory: ProductCategory | null | undefined = useSelector<
    IApplicationState,
    ProductCategory | null | undefined
  >((state) => state.product.choose.category);

  useEffect(() => {
    // let action = assignPendingActions(
    //   productSettingsActions.getAllOptionGroupsList(),
    //   [actions.myPendingAction()],
    //   [actions.myErrorPendingAction()],
    //   (args: any) => {},
    //   (args: any) => {}
    // );
    // dispatch(action);
  }, [dispatch]);

  const onRenderAssignedGroupItem = (
    item: OptionGroup | null | undefined,
    key: number | null | undefined
  ): JSX.Element => {
    let result: JSX.Element = <div>{'Undefined option group'}</div>;

    if (item && key) {
      let mandatoryColor = item.isMandatory ? '#2b579a' : '#2b579a60';

      result = (
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <Label>{`Name: ${item.name}`}</Label>{' '}
          <FontIcon
            iconName="Warning"
            className={mergeStyles({
              fontSize: 16,
              color: mandatoryColor,
            })}
          />
        </Stack>
      );
    }

    return result;
  };

  return (
    <div>
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: 20 }}>
        <Stack.Item grow={1} styles={{ root: { maxWidth: '49%' } }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Assigned groups</Separator>

              {targetProductCategory && targetProductCategory.optionGroupMaps
                ? new List(targetProductCategory.optionGroupMaps)
                    .select((item) =>
                      onRenderAssignedGroupItem(
                        item.optionGroup,
                        item.optionGroup?.id
                      )
                    )
                    .toArray()
                : 'No assignments'}
            </div>
          </FocusZone>
        </Stack.Item>

        <Stack.Item grow={1} styles={{ root: { maxWidth: '49%' } }}>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <div className={'dealer__stores'} data-is-scrollable={true}>
              <Separator alignContent="start">Option Groups</Separator>
              {'TODO: list of all groups'}
            </div>
          </FocusZone>
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default ProductCategoryDetails;
