import React from 'react';
import { OptionUnit, OptionGroup } from '../../../../../interfaces/options';
import { Stack, Text, Separator, Label, Image } from 'office-ui-fabric-react';
import { List } from 'linq-typescript';
import { buildGroupMandatoryHint } from '../../../productSettings/StylesList';
import * as fabricStyles from '../../../../../common/fabric-styles/styles';
import './allowedList.scss';

/// Build single hint lable
const _renderHintLable = (textMessage: string): JSX.Element => {
  const result = (
    <Label
      styles={{
        root: {
          fontWeight: 400,
          fontSize: '12px',
          color: '#a19f9d',
        },
      }}
    >
      {textMessage}
    </Label>
  );

  return result;
};

export class AllowedListProps {
  constructor() {
    this.optionGroups = [];
  }

  optionGroups: OptionGroup[];
}

export const AllowedList: React.FC<AllowedListProps> = (
  props: AllowedListProps
) => {
  const renderGroup = (group: OptionGroup, groupIndex: number) => {
    return (
      <Stack key={groupIndex} tokens={{ childrenGap: 6 }}>
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <Text styles={fabricStyles.textStackStyle}>{group.name}</Text>
          <Stack.Item styles={{ root: { marginTop: '-2px' } }}>
            {buildGroupMandatoryHint(group)}
          </Stack.Item>
        </Stack>
        <Stack wrap={true} horizontal tokens={{ childrenGap: 20 }}>
          {group.optionUnits.map((unit: OptionUnit, index: number) =>
            renderUnit(unit, index)
          )}
        </Stack>

        <Separator />
      </Stack>
    );
  };

  const renderUnit = (unit: OptionUnit, unitIndex: number) => {
    return (
      <div key={unitIndex} className="allowedList__unit">
        <Stack>
          <Image
            src={unit.imageUrl}
            imageFit={0}
            styles={{ root: { height: '60px', width: '60px' } }}
          ></Image>
          <Text style={{ maxWidth: '60px' }} block nowrap>
            {unit.value}
          </Text>
        </Stack>
      </div>
    );
  };

  const allowedGroups = new List(Array.from(props.optionGroups))
    .where((group: OptionGroup) => {
      return (
        group.optionUnits.length > 0 &&
        new List(group.optionUnits).any((unit: OptionUnit) => unit.isAllow)
      );
    })
    .select((group: OptionGroup) => {
      const resultGroup = { ...group };

      resultGroup.optionUnits = new List(resultGroup.optionUnits)
        .where((unit: OptionUnit) => unit.isAllow)
        .toArray();

      return resultGroup;
    })
    .toArray();

  return (
    <div className="allowedList">
      {allowedGroups.length > 0 ? (
        <Stack>
          {allowedGroups.map((group: OptionGroup, index: number) =>
            renderGroup(group, index)
          )}
        </Stack>
      ) : (
        _renderHintLable(
          'There are no allowed style options for current style permission.'
        )
      )}
    </div>
  );
};

export default AllowedList;
