import React from 'react';
import './preloader.scss';

export const PreloaderModule: React.FC = () => {
  return (
    <div id="loader" className="vertical--center">
      <div className="vertical-center__element">
        <span className="preloader preloader--top"></span>
        <span className="preloader preloader--bottom"></span>
      </div>
    </div>
  );
};
