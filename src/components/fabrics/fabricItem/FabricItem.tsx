import React from 'react';
import { Fabric } from '../../../interfaces/fabric';
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react';
import './fabricItem.scss';
import ItemInfo from './ItemInfo';

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
      <div className="fabricItem__card" onClick={(args: any) => {}}>
        <Image
          className={'fabricItem__image'}
          {...imageProps}
          src={props.fabric.imageUrl}
        ></Image>
        <ItemInfo fabric={props.fabric} />
      </div>
    </div>
  );
};

export default FabricItem;
