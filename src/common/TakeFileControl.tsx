import React from 'react';
import {
  IconButton,
  IIconProps,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
} from 'office-ui-fabric-react';

const _renderMainControlContent = (props: ITakeFileControlProps) => {
  const fileInputRef: any = React.createRef();

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <input
        accept={props.inputAccept}
        ref={fileInputRef}
        style={{
          left: '-99px',
          top: '-99px',
          height: '1px',
          width: '1px',
          position: 'absolute',
        }}
        type="file"
        onChange={(args: any) => {
          let file = args.currentTarget.files;

          if (file && file.length && file.length > 0) {
            props.onTakeFile(file[0]);
            args.currentTarget.value = '';
          }
        }}
      />
      <IconButton
        iconProps={props.iconProps}
        onClick={() => {
          if (fileInputRef && fileInputRef.current) {
            if (fileInputRef.current && document.createEvent) {
              let evt = document.createEvent('MouseEvents');
              evt.initEvent('click', true, false);
              fileInputRef.current.dispatchEvent(evt);
            }
          }
        }}
        allowDisabledFocus
      />
    </div>
  );
};

const _renderTooltipContent = (props: ITakeFileControlProps, content: any) => {
  return (
    <TooltipHost
      id={`takeFileControl`}
      calloutProps={{ gapSpace: 0 }}
      delay={TooltipDelay.zero}
      directionalHint={DirectionalHint.bottomCenter}
      styles={{ root: { display: 'inline-block' } }}
      content={props.tooltip}
    >
      {content}
    </TooltipHost>
  );
};

export const EXCEL_COMBINED_ACCEPT: string =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

export interface ITakeFileControlProps {
  inputAccept: string;
  iconProps: IIconProps;
  tooltip?: string;

  onTakeFile: (file: any) => void;
}

export const TakeFileControl: React.FC<ITakeFileControlProps> = (
  props: ITakeFileControlProps
) => {
  const content =
    props.tooltip && props.tooltip.length > 0
      ? _renderTooltipContent(props, _renderMainControlContent(props))
      : _renderMainControlContent(props);

  return content;
};

export default TakeFileControl;
