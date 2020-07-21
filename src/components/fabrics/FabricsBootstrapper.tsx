import React, { useState, useEffect } from 'react';
import Fabrics from './Fabrics';
import FabricForm from './managing/FabricForm';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../redux/reducers';
import { assignPendingActions } from '../../helpers/action.helper';
import {
  fabricActions,
  IFabricState,
} from '../../redux/slices/store/fabric/fabric.slice';
import { controlActions } from '../../redux/slices/control.slice';
import { List } from 'linq-typescript';
import { TokenHelper } from '../../helpers/token.helper';
import { RoleType } from '../../interfaces/identity';

export const CREATE_YOUR_FIRST_FABRIC: string = 'Create your first fabric';
export const NO_AVAILABLE_FABRICS: string = 'No available fabrics';
export const CREATE_FABRIC: string = 'Create fabric';

const FabricsViewBootstrapper: React.FC = () => {
  const dispatch = useDispatch();

  const [isWasIntended, setIsWasIntended] = useState<boolean>(false);

  const isEmpty: boolean = useSelector<IApplicationState, boolean>(
    (state) => state.fabric.fabrics.length === 0
  );

  const fabricState: IFabricState = useSelector<
    IApplicationState,
    IFabricState
  >((state) => state.fabric);

  useEffect(() => {
    dispatch(
      assignPendingActions(
        fabricActions.apiGetAllFabrics({
          paginationPageNumber:
            fabricState.pagination.paginationInfo.pageNumber,
          paginationLimit: fabricState.pagination.limit,

          searchPhrase: fabricState.searchWord,
          filterBuilder: fabricState.filters,
        }),
        [],
        [],
        (args: any) => {
          setIsWasIntended(true);
          dispatch(fabricActions.changeFabrics(args.entities));
          dispatch(fabricActions.changePaginationInfo(args.paginationInfo));
        },
        (args: any) => {
          setIsWasIntended(true);
        }
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /// Resolve dashboard hint visibility
  useEffect(() => {
    if (isWasIntended) {
      if (isEmpty) {
        const rolesList = new List(TokenHelper.extractRolesFromJWT());
        const canManageFabrics: boolean = rolesList.contains(
          RoleType[RoleType.Administrator] || RoleType[RoleType.Manufacturer]
        );

        dispatch(
          controlActions.showDashboardHintStub({
            isVisible: true,
            title: canManageFabrics
              ? CREATE_YOUR_FIRST_FABRIC
              : NO_AVAILABLE_FABRICS,
            isButtonAvailable: canManageFabrics,
            buttonLabel: CREATE_FABRIC,
            buttonAction: () => {
              dispatch(
                controlActions.openRightPanel({
                  title: 'New Fabric',
                  width: '900px',
                  closeFunctions: () => {
                    dispatch(controlActions.closeRightPanel());
                  },
                  component: FabricForm,
                })
              );
            },
          })
        );
      } else {
        dispatch(controlActions.closeDashboardHintStub());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWasIntended, isEmpty]);

  return <>{isWasIntended ? <Fabrics /> : null}</>;
};

export default FabricsViewBootstrapper;
