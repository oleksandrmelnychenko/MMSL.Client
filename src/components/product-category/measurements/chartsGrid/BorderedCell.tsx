import React from 'react';
import './borderedCell.scss';

const BorderedCell: React.FC<any> = (porps: any) => {
  return <div className="borderedCell">{porps.children}</div>;
};

export default BorderedCell;
