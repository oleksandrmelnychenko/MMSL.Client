import { ICommandBarItemProps } from 'office-ui-fabric-react';
import { commandBarButtonStyles } from '../common/fabric-styles/styles';

export enum CommandBarItem {
  New,
  Save,
  Reset,
  Delete,
}

export class CommandBarItemCreatorProps {
  key!: string;
  text!: string;
  iconName!: string;
  disabled?: boolean;
  onClick?: () => {};
  buttonStyles?: any;
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
      } as CommandBarItemCreatorProps);
    case CommandBarItem.Save:
      return CommandBarItemCreator({
        key: 'Save',
        text: 'Save',
        iconName: 'Save',
        disabled: true,
        onClick: clickFunc,
      } as CommandBarItemCreatorProps);
    case CommandBarItem.Reset:
      return CommandBarItemCreator({
        key: 'Reset',
        text: 'Reset',
        iconName: 'Refresh',
        disabled: true,
        onClick: clickFunc,
      } as CommandBarItemCreatorProps);
    case CommandBarItem.Delete:
      return CommandBarItemCreator({
        key: 'Delete',
        text: 'Delete',
        disabled: true,
        iconName: 'Delete',
        onClick: clickFunc,
      } as CommandBarItemCreatorProps);
  }
};
