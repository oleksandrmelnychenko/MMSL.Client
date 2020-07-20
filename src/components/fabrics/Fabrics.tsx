import React from 'react';
import { IApplicationState } from '../../redux/reducers';
import { useSelector } from 'react-redux';
import { Fabric } from '../../interfaces/fabric';

const Fabrics: React.FC = () => {
  const fabrics: Fabric[] = useSelector<IApplicationState, Fabric[]>(
    (state) => state.fabric.fabrics
  );

  return <div>{fabrics.length}</div>;
};

export default Fabrics;
