import React from 'react';
import { Fabric } from '../../../interfaces/fabric';
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react';
import './fabricItem.scss';
import ItemInfo from './ItemInfo';

const DATA_SELECTION_DISABLED_CLASS: string = 'dataSelectionDisabled';

export interface IFabricItemProps {
  fabric: Fabric;
}

const FabricItem: React.FC<IFabricItemProps> = (props: IFabricItemProps) => {
  const imageProps: IImageProps = {
    src: props.fabric.imageUrl,
    imageFit: ImageFit.cover,
    width: '100%',
    height: '100%',
  };

  return (
    <div className="fabricItem">
      <div
        className="fabricItem__card"
        onClick={(args: any) => {
          const className: any = args?.target?.className;

          if (!className.includes(DATA_SELECTION_DISABLED_CLASS)) {
            // if (category.id !== chooseCategory?.id) {
            //   dispatch(
            //     assignPendingActions(
            //       productActions.apiGetProductCategoryById(category.id),
            //       [],
            //       [],
            //       (args: any) => {
            //         dispatch(productActions.chooseProductCategory(args));
            //         dispatch(
            //           controlActions.openInfoPanelWithComponent({
            //             component: ProductManagementPanel,
            //             onDismisPendingAction: () => {
            //               dispatch(productActions.chooseProductCategory(null));
            //             },
            //           })
            //         );
            //       }
            //     )
            //   );
            // }
          }
        }}
      >
        <Image {...imageProps} src={props.fabric.imageUrl}></Image>
        <ItemInfo fabric={props.fabric} />
      </div>
    </div>
  );
};

export default FabricItem;
