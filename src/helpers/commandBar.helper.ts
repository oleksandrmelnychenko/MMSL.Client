import { ICommandBarItemProps } from 'office-ui-fabric-react';
import { commandBarButtonStyles } from '../common/fabric-styles/styles';
import { List } from 'linq-typescript';

export enum CommandBarItem {
  New,
  Save,
  Reset,
  Delete,
}

export interface IButtonAvailability {
  command: CommandBarItem;
  isDisabled: boolean;
}

export class CommandBarItemCreatorProps {
  key!: string;
  text!: string;
  iconName!: string;
  disabled?: boolean;
  onClick?: () => {};
  buttonStyles?: any;
  commandType!: CommandBarItem;
}

function CommandBarItemCreator(
  props: CommandBarItemCreatorProps
): ICommandBarItemProps {
  return {
    key: props.key,
    text: props.text,
    iconProps: { iconName: props.iconName },
    disabled: props.disabled ? props.disabled : false,
    onClick: (props.onClick ? props.onClick : null) as any,
    buttonStyles: props.buttonStyles
      ? props.buttonStyles
      : commandBarButtonStyles,
    commandType: props.commandType,
  };
}

const GetCommandBarItemKeysForDisable = (items: CommandBarItem[]) => {
  let keyArray: string[] = [];
  items.forEach((item) => {
    keyArray.push(CommandBarItem[item]);
  });

  return keyArray;
};

export const ChangeItemsDisabledState = (
  commandBarItems: any[],
  disableList: CommandBarItem[],
  stateToSet: boolean
) =>
  commandBarItems.map((item: any) =>
    Object.assign({}, item, {
      disabled:
        GetCommandBarItemKeysForDisable(disableList).indexOf(item.key) !== -1
          ? stateToSet
          : item.disabled,
    })
  );

export const ChangeItemsDisabledStatePartialy = (
  commandBarItems: any[],
  availabilityPairs: IButtonAvailability[]
) =>
  commandBarItems.map((commandItem: any) => {
    let result = Object.assign({}, commandItem);

    const availabilityPair: IButtonAvailability | null | undefined = new List(
      availabilityPairs
    ).firstOrDefault(
      (pairItem) => pairItem.command === commandItem.commandType
    );

    if (availabilityPair) {
      result.disabled = availabilityPair.isDisabled;
    }

    return result;
  });

export const GetCommandBarItemProps = (
  item: CommandBarItem,
  clickFunc: any
) => {
  switch (item) {
    case CommandBarItem.New:
      return CommandBarItemCreator({
        key: 'New',
        text: 'New',
        iconName: 'Add',
        onClick: clickFunc,
        commandType: item,
      } as CommandBarItemCreatorProps);
    case CommandBarItem.Save:
      return CommandBarItemCreator({
        key: 'Save',
        text: 'Save',
        iconName: 'Save',
        disabled: true,
        onClick: clickFunc,
        commandType: item,
      } as CommandBarItemCreatorProps);
    case CommandBarItem.Reset:
      return CommandBarItemCreator({
        key: 'Reset',
        text: 'Reset',
        iconName: 'Refresh',
        disabled: true,
        onClick: clickFunc,
        commandType: item,
      } as CommandBarItemCreatorProps);
    case CommandBarItem.Delete:
      return CommandBarItemCreator({
        key: 'Delete',
        text: 'Delete',
        disabled: true,
        iconName: 'Delete',
        onClick: clickFunc,
        commandType: item,
      } as CommandBarItemCreatorProps);
  }
};
