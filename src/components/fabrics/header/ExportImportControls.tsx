import React from 'react';
import {
  Stack,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  IconButton,
} from 'office-ui-fabric-react';
import TakeFileControl, {
  EXCEL_COMBINED_ACCEPT,
} from '../../../common/TakeFileControl';

export interface IExportImportControlsProps {
  style?: any;
}

export const ExportImportControls: React.FC<IExportImportControlsProps> = (
  props: IExportImportControlsProps
) => {
  return (
    <Stack horizontal style={{ ...props.style }}>
      <TakeFileControl
        iconProps={{
          iconName: 'ExcelLogoInverse16',
        }}
        inputAccept={EXCEL_COMBINED_ACCEPT}
        tooltip="Import fabrics from excel"
        onTakeFile={(file: any) => {
          console.log(file);
        }}
      />

      <TooltipHost
        id={`exportFabricsToPDF`}
        calloutProps={{ gapSpace: 0 }}
        delay={TooltipDelay.zero}
        directionalHint={DirectionalHint.bottomCenter}
        styles={{ root: { display: 'inline-block' } }}
        content={'Export fabrics to pdf'}
      >
        <IconButton
          iconProps={{
            iconName: 'PDF',
          }}
          onClick={() => {}}
        />
      </TooltipHost>
    </Stack>
  );
};

export default ExportImportControls;
