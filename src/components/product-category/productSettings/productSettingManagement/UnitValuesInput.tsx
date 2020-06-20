import React, { useState } from 'react';
import {
  DefaultButton,
  ISearchBoxStyles,
  SearchBox,
  Icon,
  IContextualMenuListProps,
  IContextualMenuItem,
  IRenderFunction,
  Fabric,
  initializeIcons,
} from 'office-ui-fabric-react';

export interface IUnitValuesInputProps {}

const UnitValuesInput: React.FC<IUnitValuesInputProps> = (
  props: IUnitValuesInputProps
) => {
  const [items, setItems] = React.useState(menuItems);

  const onAbort = () => {
    setItems(menuItems);
  };

  const onChange = (ev: any, newValue: any) => {
    const filteredItems = menuItems.filter(
      (item) =>
        item.text &&
        item.text.toLowerCase().indexOf(newValue.toLowerCase()) !== -1
    );

    if (!filteredItems || !filteredItems.length) {
      filteredItems.push({
        key: 'no_results',
        onRender: (item, dismissMenu) => (
          <div key="no_results" style={filteredItemsStyle}>
            <Icon iconName="SearchIssue" title="No actions found" />
            <span>No actions found</span>
          </div>
        ),
      });
    }

    setItems(filteredItems);
  };

  const renderMenuList = (menuListProps: any, defaultRender: any) => {
    return (
      <div>
        <div style={wrapperStyle}>
          <SearchBox
            ariaLabel="Filter actions by text"
            placeholder="Filter actions"
            onAbort={onAbort}
            onChange={onChange}
            styles={searchBoxStyles}
          />
        </div>
        {defaultRender(menuListProps)}
      </div>
    );
  };

  //   const menuProps = React.useMemo(
  //     () => ({
  //       onRenderMenuList: renderMenuList,
  //       title: 'Actions',
  //       shouldFocusOnMount: true,
  //       items,
  //     }),
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     [items]
  //   );

  return (
    <DefaultButton
      text="Click for ContextualMenu"
      menuProps={{
        onRenderMenuList: renderMenuList,
        title: 'Actions',
        shouldFocusOnMount: true,
        items,
      }}
    />
  );
};

const wrapperStyle: React.CSSProperties = { borderBottom: '1px solid #ccc' };
const filteredItemsStyle: React.CSSProperties = {
  width: '100%',
  height: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const searchBoxStyles: ISearchBoxStyles = {
  root: { margin: '8px' },
};

const menuItems: IContextualMenuItem[] = [
  {
    key: 'newItem',
    text: 'New',
    onClick: () => console.log('New clicked'),
  },
  {
    key: 'rename',
    text: 'Rename',
    onClick: () => console.log('Rename clicked'),
  },
  {
    key: 'edit',
    text: 'Edit',
    onClick: () => console.log('Edit clicked'),
  },
  {
    key: 'properties',
    text: 'Properties',
    onClick: () => console.log('Properties clicked'),
  },
  {
    key: 'linkNoTarget',
    text: 'Link same window',
    href: 'http://bing.com',
  },
  {
    key: 'linkWithTarget',
    text: 'Link new window',
    href: 'http://bing.com',
    target: '_blank',
  },
  {
    key: 'linkWithOnClick',
    name: 'Link click',
    href: 'http://bing.com',
    onClick: (ev: any) => {
      alert('Link clicked');
      ev.preventDefault();
    },
    target: '_blank',
  },
  {
    key: 'disabled',
    text: 'Disabled item',
    disabled: true,
    onClick: () => console.error('Disabled item should not be clickable.'),
  },
];

export default UnitValuesInput;
