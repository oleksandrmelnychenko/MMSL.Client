import React from 'react';
import {
  Stack,
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  IconButton,
  Spinner,
  SpinnerSize,
} from 'office-ui-fabric-react';
import TakeFileControl, {
  EXCEL_COMBINED_ACCEPT,
} from '../../../common/TakeFileControl';
import { useDispatch, useSelector } from 'react-redux';
import { fabricImporterActions } from '../../../redux/slices/store/fabric/fabricImporter.slice';
import { assignPendingActions } from '../../../helpers/action.helper';
import { fabricFiltersActions } from '../../../redux/slices/store/fabric/fabricFilters.slice';
import { fabricActions } from '../../../redux/slices/store/fabric/fabric.slice';
import { IApplicationState } from '../../../redux/reducers';
import './exportImportControls.scss';

export interface IExportImportControlsProps {
  canManageFabrics: boolean;
  style?: any;
}

export const ExportImportControls: React.FC<IExportImportControlsProps> = (
  props: IExportImportControlsProps
) => {
  const dispatch = useDispatch();

  const { isImporting, isExporting }: any = useSelector<IApplicationState, any>(
    (state) => state.fabricImporter
  );

  return (
    <Stack
      className="exportImportControls"
      horizontal
      style={{ ...props.style }}
    >
      {props.canManageFabrics ? (
        isImporting ? (
          <div className="exportImportControls__spinerWrapper">
            <Spinner size={SpinnerSize.small} />
          </div>
        ) : (
          <TakeFileControl
            iconProps={{
              iconName: 'ExcelLogoInverse16',
            }}
            inputAccept={EXCEL_COMBINED_ACCEPT}
            tooltip="Import fabrics from excel"
            onTakeFile={(file: any) => {
              dispatch(
                assignPendingActions(
                  fabricImporterActions.apiImportFabricsFromExcel(file),
                  [],
                  [],
                  (args: any) => {
                    dispatch(
                      assignPendingActions(
                        fabricFiltersActions.apiGetFilters(),
                        [],
                        [],
                        (args: any) => {
                          dispatch(
                            fabricFiltersActions.changeAndApplyFilters(args)
                          );

                          dispatch(
                            assignPendingActions(
                              fabricActions.apiGetAllFabricsPaginated(),
                              [],
                              [],
                              (args: any) => {
                                dispatch(
                                  fabricActions.changeFabrics(args.entities)
                                );
                              },
                              (args: any) => {}
                            )
                          );
                        },
                        (args: any) => {}
                      )
                    );
                  },
                  (args: any) => {}
                )
              );
            }}
          />
        )
      ) : null}

      {isExporting ? (
        <div className="exportImportControls__spinerWrapper">
          <Spinner size={SpinnerSize.small} />
        </div>
      ) : (
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
            onClick={() => {
              dispatch(
                assignPendingActions(
                  fabricImporterActions.apiExportToPDFPaginated(),
                  [],
                  [],
                  (args: any) => {
                    window.open(args);

                    // var link = document.createElement('a');
                    // // If you don't know the name or want to use
                    // // the webserver default set name = ''
                    // link.setAttribute('download', 'foo');
                    // link.href = args;
                    // link.rel = 'noopener noreferrer';
                    // document.body.appendChild(link);
                    // link.click();
                    // link.remove();
                  },
                  (args: any) => {}
                )
              );
            }}
          />
        </TooltipHost>
      )}
    </Stack>
  );
};

export default ExportImportControls;
