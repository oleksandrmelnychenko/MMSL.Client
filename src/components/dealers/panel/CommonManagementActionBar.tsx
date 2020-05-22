import './commonManagementActionBar.scss';
import React from 'react';
import { ICommandBarItemProps, CommandBar } from 'office-ui-fabric-react';
import {
  commandBarStyles,
  commandBarButtonStyles,
} from '../../../common/fabric-styles/styles';
import { List } from 'linq-typescript';

export const NEW_PANEL_ITEM_NAME = 'New';
export const DELETE_PANEL_ITEM_NAME = 'Delete';
export const SAVE_PANEL_ITEM_NAME = 'Save';
export const RESET_PANEL_ITEM_NAME = 'Reset';

/// Simply hides "Add" and "Edit" panel buttons
export const hideAddEditPanelActions = (actions: ICommandBarItemProps[]) => {
  const saveButton = new List(actions).firstOrDefault(
    (item) => item.key === NEW_PANEL_ITEM_NAME
  );
  const deleteButton = new List(actions).firstOrDefault(
    (item) => item.key === DELETE_PANEL_ITEM_NAME
  );

  if (saveButton)
    saveButton.buttonStyles = {
      root: { display: 'none' },
    };

  if (deleteButton)
    deleteButton.buttonStyles = {
      root: { display: 'none' },
    };
};

export const buildCommonActionItems = () => {
  const _items: ICommandBarItemProps[] = [
    {
      key: NEW_PANEL_ITEM_NAME,
      text: NEW_PANEL_ITEM_NAME,
      iconProps: { iconName: 'Add' },
      onClick: () => {},
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: SAVE_PANEL_ITEM_NAME,
      text: SAVE_PANEL_ITEM_NAME,
      disabled: true,
      iconProps: { iconName: 'Save' },
      onClick: () => {},
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: RESET_PANEL_ITEM_NAME,
      text: RESET_PANEL_ITEM_NAME,
      disabled: true,
      iconProps: { iconName: 'Refresh' },
      onClick: () => {},
      buttonStyles: commandBarButtonStyles,
    },
    {
      key: DELETE_PANEL_ITEM_NAME,
      text: DELETE_PANEL_ITEM_NAME,
      iconProps: { iconName: 'Delete' },
      disabled: true,
      onClick: () => {},
      buttonStyles: commandBarButtonStyles,
    },
  ];

  return _items;
};

export class CommonManagementActionBarProps {
  constructor() {
    this.actionItems = [];
  }

  actionItems: ICommandBarItemProps[];
}

export const CommonManagementActionBar: React.FC<CommonManagementActionBarProps> = (
  props: CommonManagementActionBarProps
) => {
  return (
    <div className="commonManagementActionBar">
      <CommandBar
        styles={commandBarStyles}
        items={props.actionItems}
        className="commonManagementActionBar__controls"
      />
    </div>
  );
};

export default CommonManagementActionBar;
