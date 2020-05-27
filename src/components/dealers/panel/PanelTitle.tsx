import React from 'react';
import { Text, Stack, Separator } from 'office-ui-fabric-react';

import './panelTitle.scss';

class PanelTitleProps {
  constructor() {
    this.title = '';
    this.description = [];
  }

  title: string;
  description?: string[] | null;
}

export const PanelTitle: React.FC<PanelTitleProps> = (
  props: PanelTitleProps
) => {
  const panelDescriptionStyle = {
    display: 'flex',
    height: '20px',
  };

  const renderPanelDescription = (arrayItems: string[]) => {
    return (
      <div style={panelDescriptionStyle}>
        {arrayItems.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <span
                style={
                  index === 0 ? { padding: '0 5px 0 0' } : { padding: '0 5px' }
                }>
                {item}
              </span>
              {++index !== arrayItems.length ? <Separator vertical /> : null}
            </React.Fragment>
          );
        })}
      </div>
    );
  };
  return (
    <div className="panelTitle">
      <Stack
        tokens={{ childrenGap: 20 }}
        horizontal
        className="panelTitle__panelHeader">
        <Text className="panelTitle__title">{props.title}</Text>
        <Text className="panelTitle__description">
          {props.description ? renderPanelDescription(props.description) : null}
        </Text>
      </Stack>
    </div>
  );
};

export default PanelTitle;
