import React from 'react';

import './footer.scss';
import StatusBar from '../../../common/statusBar/StatusBar';

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="footer__body">byMMSL</div>
      <StatusBar />
    </div>
  );
};

export default Footer;
