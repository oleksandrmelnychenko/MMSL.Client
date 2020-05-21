import React from 'react';
import { Text, Stack } from 'office-ui-fabric-react';

import './panelTitle.scss';

class PanelTitleProps {
  constructor() {
    this.title = '';
    this.description = '';
  }

  title: string;
  description?: string;
}

export const PanelTitle: React.FC<PanelTitleProps> = (
  props: PanelTitleProps
) => {
  return (
    <div className="panelTitle">
      <Stack
        tokens={{ childrenGap: 20 }}
        horizontal
        className="panelTitle__panelHeader">
        <Text className="panelTitle__title">{props.title}</Text>
        <Text className="panelTitle__description">{props.description}</Text>
      </Stack>
    </div>
  );
};

export default PanelTitle;
