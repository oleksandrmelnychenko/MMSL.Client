import React, { useState } from 'react';
import { OptionUnit, OptionGroup } from '../../../../../interfaces';
import { Stack, Checkbox, Text, Separator } from 'office-ui-fabric-react';
import StyleUnitAssigningItem, {
  UnitAssigningContext,
} from './StyleUnitAssigningItem';
import { List } from 'linq-typescript';

export class GroupAssigningContext {
  private _rawSource: OptionGroup;

  constructor(group: OptionGroup) {
    this._rawSource = group;
    this.name = `${group.name}`;

    this.styleUnits = group.optionUnits
      ? new List(group.optionUnits)
          .select((unitItem: OptionUnit) => new UnitAssigningContext(unitItem))
          .toArray()
      : [];

    this.indeterminate = this.isIndeterminate();
    this.checked = this.isChecked();
  }

  name: string;
  indeterminate: boolean;
  checked: boolean;

  styleUnits: UnitAssigningContext[];

  setChecked: (checked: boolean) => void = (checked: boolean) => {
    this.styleUnits.forEach((unit: UnitAssigningContext) => {
      unit.checked = checked;
      unit.isDirty();
    });

    this.isChecked();
    this.isIndeterminate();
  };

  isIndeterminate: () => boolean = () => {
    if (this.styleUnits.length > 0) {
      this.indeterminate =
        new List(this.styleUnits).any(
          (unitContext: UnitAssigningContext) => unitContext.checked
        ) ===
        new List(this.styleUnits).any(
          (unitContext: UnitAssigningContext) => !unitContext.checked
        );
    } else {
      this.indeterminate = false;
    }

    return this.indeterminate;
  };

  isChecked: () => boolean = () => {
    if (this.styleUnits.length > 0) {
      this.checked = new List(this.styleUnits).all(
        (unitContext: UnitAssigningContext) => unitContext.checked
      );
    } else {
      this.checked = false;
    }

    return this.checked;
  };

  isDirty: () => boolean = () => {
    let result = false;

    result = new List(
      this.styleUnits
    ).any((unitContext: UnitAssigningContext) => unitContext.isDirty());

    return result;
  };
}

export class StyleGroupAssigningItemProps {
  constructor() {
    this.context = new GroupAssigningContext(new OptionGroup());
    this.changedCallback = () => {};
  }

  context: GroupAssigningContext;
  changedCallback: () => void;
}

export const StyleGroupAssigningItem: React.FC<StyleGroupAssigningItemProps> = (
  props: StyleGroupAssigningItemProps
) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);

  const resolveOwnState = () => {
    if (checked !== props.context.isChecked())
      setChecked(props.context.checked);
    if (indeterminate !== props.context.isIndeterminate())
      setIndeterminate(props.context.indeterminate);
  };

  resolveOwnState();

  return (
    <div className="styleGroupAssigningItem">
      <Stack>
        <Stack disableShrink={false} horizontal tokens={{ childrenGap: 6 }}>
          <Stack.Item align="start">
            <Checkbox
              disabled={props.context.styleUnits.length === 0}
              onChange={(ev?: any, checked?: boolean) => {
                props.context.setChecked(
                  checked !== null && checked !== undefined ? checked : false
                );

                resolveOwnState();

                props.changedCallback();
              }}
              checked={checked}
              indeterminate={indeterminate}
            />
          </Stack.Item>
          <Stack.Item align="start">
            <Stack>
              <Text styles={{ root: { marginBottom: '6px' } }}>
                {props.context.name}
              </Text>
              <Stack tokens={{ childrenGap: 6 }}>
                {props.context.styleUnits.map(
                  (item: UnitAssigningContext, index: number) => (
                    <StyleUnitAssigningItem
                      key={index}
                      context={item}
                      changedCallback={() => {
                        resolveOwnState();
                        props.context.isDirty();

                        props.changedCallback();
                      }}
                    />
                  )
                )}
              </Stack>
            </Stack>
          </Stack.Item>
        </Stack>

        <Separator />
      </Stack>
    </div>
  );
};

export default StyleGroupAssigningItem;
