import React, { useEffect } from 'react';
import { Label, PrimaryButton } from 'office-ui-fabric-react';
import { dealerActions } from '../../../redux/slices/dealer.slice';
import {
  ToggleDealerPanelWithDetails,
  DealerDetilsComponents,
} from '../../../redux/slices/dealer.slice';
import { useDispatch, useSelector } from 'react-redux';
import { labelStyle, btnMenuStyle } from '../../../common/fabric-styles/styles';
import { IApplicationState } from '../../../redux/reducers/index';
import { ImenuItem } from '../../../interfaces';
import { controlActions } from '../../../redux/slices/control.slice';
import ManageDealerForm from '../managing/dealerManaging/ManageDealerForm';
import ProductAvailabilityForm from '../managing/dealerProductManaging/ProductAvailabilityForm';
import { DealerAccount } from '../../../interfaces/dealer';

const DealerOptions: React.FC = () => {
  const dispatch = useDispatch();

  const isOpenPanelWithDealerDetails = useSelector<
    IApplicationState,
    ToggleDealerPanelWithDetails
  >((state) => state.dealer.isOpenPanelWithDealerDetails);

  const dealer = useSelector<IApplicationState, DealerAccount | null>(
    (state) => state.dealer.selectedDealer
  );

  // const changeSelectedMenuItem = (componentType: number) => {
  //   const updateMenu = menu.map((item) => {
  //     item.isSelected = false;
  //     if (item.componentType === componentType) {
  //       item.isSelected = true;
  //     }
  //     return item;
  //   });

  //   setMenu(updateMenu);
  // };

  useEffect(() => {
    return () => {
      dispatch(dealerActions.setSelectedDealer(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   changeSelectedMenuItem(isOpenPanelWithDealerDetails.componentType);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isOpenPanelWithDealerDetails]);

  const menuItem: ImenuItem[] = [
    {
      title: 'Stores',
      className: 'management__btn-add',
      componentType: DealerDetilsComponents.DealerStores,
      onClickAction: () => {},
      isSelected: false,
    },
    {
      title: 'Details',
      className: 'management__btn-detail',
      componentType: DealerDetilsComponents.DealerDetails,
      onClickAction: () => {
        dispatch(
          controlActions.openRightPanel({
            title: 'Edit dealer',
            width: '600px',
            closeFunctions: () => {
              dispatch(controlActions.closeRightPanel());
            },
            component: ManageDealerForm,
          })
        );
      },
      isSelected: false,
    },
    {
      title: 'Address',
      className: 'management__btn-address',
      componentType: DealerDetilsComponents.DealerAddress,
      onClickAction: () => {},
      isSelected: false,
    },
    {
      title: 'Customer',
      className: 'management__btn-customer',
      componentType: DealerDetilsComponents.DealerCustomers,
      onClickAction: () => {},
      isSelected: false,
    },
    // {
    //   title: 'Products',
    //   className: 'management__btn-styles',
    //   componentType: DealerDetilsComponents.DealerProducts,
    //   onClickAction: () => {
    //     if (dealer) {
    //       dispatch(
    //         controlActions.openRightPanel({
    //           title: 'Manage products',
    //           description: dealer.name,
    //           width: '600px',
    //           closeFunctions: () => {
    //             dispatch(controlActions.closeRightPanel());
    //           },
    //           component: ProductAvailabilityForm,
    //         })
    //       );
    //     }
    //   },
    //   isSelected: false,
    // },
  ];

  // const [menu, setMenu] = useState(menuItem);

  return (
    <div className="management">
      {menuItem.map((item, index) => (
        <Label
          key={index}
          styles={labelStyle}
          className={`${
            item.isSelected && isOpenPanelWithDealerDetails ? 'selected' : ''
          }`}
        >
          <PrimaryButton
            styles={btnMenuStyle}
            className={item.className}
            onClick={() => {
              if (
                item.componentType === DealerDetilsComponents.DealerDetails ||
                item.componentType === DealerDetilsComponents.DealerProducts
              ) {
                if (item.onClickAction) item.onClickAction();
              } else {
                // changeSelectedMenuItem(item.componentType);
                const openDetailsArgs: ToggleDealerPanelWithDetails = new ToggleDealerPanelWithDetails();
                openDetailsArgs.isOpen = true;
                openDetailsArgs.componentType = item.componentType;

                dispatch(
                  dealerActions.isOpenPanelWithDealerDetails(openDetailsArgs)
                );
              }
            }}
            allowDisabledFocus
          />
          {item.title}
        </Label>
      ))}
    </div>
  );
};

export default DealerOptions;
