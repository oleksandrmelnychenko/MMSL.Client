import React, { useState, useEffect } from 'react';
import {
  Text,
  ShimmeredDetailsList,
  SelectionMode,
  IColumn,
} from 'office-ui-fabric-react';
import { detailsListStyle } from '../../../common/fabric-styles/styles';
import { useDispatch, useSelector } from 'react-redux';
import { IApplicationState } from '../../../redux/reducers';
import * as controlActions from '../../../redux/actions/control.actions';
import * as productCategoryActions from '../../../redux/actions/productCategory.actions';
import {
  Measurement,
  measurementMapDefinitions,
  MeasurementSize,
} from '../../../interfaces';
import { List } from 'linq-typescript';
import { useHistory } from 'react-router-dom';

const MeasurementsList: React.FC = () => {
  const dispatch = useDispatch();

  const shimmer = useSelector<IApplicationState, boolean>(
    (state) => state.control.isGlobalShimmerActive
  );

  const chooseProductCategoryID = useSelector<IApplicationState, number | null>(
    (state) => state.product.choose.categoryId
  );

  const measurements = useSelector<IApplicationState, Measurement[]>(
    (state) => state.product.choose.measurements
  );

  const categoryId = useSelector<IApplicationState, number | null>(
    (state) => state.product.choose.categoryId
  );

  const [columnsHeader, setColumnsHeader] = useState<IColumn[]>([]);

  const [listItemSizes, setListItemSizes] = useState<any[]>([]);

  const history = useHistory();

  useEffect(() => {
    if (!categoryId) {
      history.push('/en/app/product/product-categories');
    }
  }, [categoryId]);

  useEffect(() => {
    dispatch(controlActions.showGlobalShimmer());
    if (chooseProductCategoryID) {
      dispatch(
        productCategoryActions.apiGetMeasurementsByProduct(
          chooseProductCategoryID
        )
      );
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const [selection] = useState(
  //   new Selection({
  //     onSelectionChanged: () => {
  //       /// TODO: important
  //       if (selection.count > 0) {
  //         customerSelection();
  //       } else {
  //         // customerUnSelection();
  //       }
  //     },
  //   })
  // );

  useEffect(() => {
    const total = new List<Measurement>(measurements).sum(
      (c) => c.measurementSizes.length
    );

    if (listItemSizes.length < total) {
      builderDetailList();
      builderDetailsRow();
    } else {
      dispatch(controlActions.hideGlobalShimmer());
    }
  }, [measurements]);

  const builderDetailList = () => {
    let defaultColumnsHeader = [
      {
        key: 'name',
        name: 'Size',
        minWidth: 50,
        maxWidth: 50,
        onRender: (item: any) => {
          return <Text>{item.name}</Text>;
        },
      },
    ];

    const measurementHeader = new List(measurements)
      .selectMany<measurementMapDefinitions>(
        (measurement) => measurement.measurementMapDefinitions
      )
      .select((definition) => {
        return {
          key: definition.measurementDefinition.name,
          name: definition.measurementDefinition.name,
          minWidth: 50,
          maxWidth: 100,
          onRender: (item: any, index: any) => {
            let cellValue: string = '';

            if (item && item.values && item.values.length) {
              let resolvedValue: any = new List(item.values).firstOrDefault(
                (valueItem: any) => {
                  return (
                    valueItem.measurementDefinitionId ===
                    definition.measurementDefinitionId
                  );
                }
              );

              if (resolvedValue) {
                cellValue = resolvedValue.value;
              }
            }

            return <Text>{cellValue}</Text>;
          },
        };
      })
      .toArray();

    setColumnsHeader([...defaultColumnsHeader, ...measurementHeader]);
  };

  const builderDetailsRow = () => {
    const measurementsSizes = new List(measurements)
      .selectMany<MeasurementSize>(
        (measurement) => measurement.measurementSizes
      )
      .toArray();

    setListItemSizes(measurementsSizes);
  };

  return (
    <div>
      <ShimmeredDetailsList
        enableShimmer={shimmer}
        styles={detailsListStyle}
        items={listItemSizes}
        // selection={selection}
        selectionMode={SelectionMode.single}
        columns={columnsHeader}
      />
    </div>
  );
};

export default MeasurementsList;
