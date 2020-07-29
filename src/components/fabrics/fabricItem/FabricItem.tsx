import React, { useState, useEffect } from 'react';
import { Fabric } from '../../../interfaces/fabric';
import {
  Image,
  IImageProps,
  ImageFit,
  ImageLoadState,
  FontIcon,
} from 'office-ui-fabric-react';
import './fabricItem.scss';
import ItemInfo from './ItemInfo';

export interface IFabricItemProps {
  fabric: Fabric;
}

const FabricItem: React.FC<IFabricItemProps> = (props: IFabricItemProps) => {
  const [showImageStub, setShowImageStub] = useState<boolean>(true);

  useEffect(() => {
    if (props.fabric && props.fabric.imageUrl) {
      if (props.fabric.imageUrl.length > 0) {
        setShowImageStub(false);
      } else {
        setShowImageStub(true);
      }
    }
  }, [props.fabric]);

  return (
    <div className="fabricItem">
      <div className="fabricItem__card">
        {showImageStub ? (
          <div className="fabricItem__centeredStub">
            <FontIcon
              iconName="ImagePixel"
              style={{
                fontSize: 50,
                marginTop: '-69px',
                color: '#c8c6c4',
              }}
            />
          </div>
        ) : (
          <Image
            src={props.fabric.imageUrl}
            imageFit={ImageFit.cover}
            className={'fabricItem__image'}
            onLoadingStateChange={(loadState: ImageLoadState) => {
              if (loadState === ImageLoadState.loaded) {
                setShowImageStub(false);
              } else {
                setShowImageStub(true);
              }
            }}
          ></Image>
        )}

        <ItemInfo fabric={props.fabric} />
      </div>
    </div>
  );
};

export default FabricItem;
