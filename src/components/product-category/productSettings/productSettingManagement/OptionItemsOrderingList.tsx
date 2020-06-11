import React, { useState } from 'react';
import {
  DetailsList,
  IColumn,
  Selection,
  IDragDropContext,
  mergeStyles,
  getTheme,
  SelectionMode,
  CheckboxVisibility,
  DetailsRow,
  FontIcon,
} from 'office-ui-fabric-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../../../redux/reducers';
import { assignPendingActions } from '../../../../helpers/action.helper';
import { productSettingsActions } from '../../../../redux/slices/productSettings.slice';
import {
  ModifiedOptionUnitOrder,
  OptionUnit,
} from '../../../../interfaces/options';
import { ProductCategory } from '../../../../interfaces/products';
import { List } from 'linq-typescript';
import { DATA_SELECTION_DISABLED_CLASS } from '../../../dealers/DealerList';

export const OptionItemsOrderingList: React.FC = () => {
  const dispatch = useDispatch();

  const [selection] = useState(new Selection());
  const [draggedItem, setDraggedItem] = useState<
    OptionUnit | null | undefined
  >();
  const [draggedIndex, setDraggedIndex] = useState<number>(-1);

  const targetProduct: ProductCategory | null = useSelector<
    IApplicationState,
    ProductCategory | null
  >((state) => state.product.choose.category);

  const optionUnits: OptionUnit[] = useSelector<
    IApplicationState,
    OptionUnit[]
  >((state) => state.productSettings.managingOptionUnitsState.optionUnits);

  const selectedOptionUnitId: number | null | undefined = useSelector<
    IApplicationState,
    number | null | undefined
  >(
    (state) =>
      state.productSettings.managingOptionUnitsState.selectedOptionUnit?.id
  );

  const dragEnterClass = mergeStyles({
    backgroundColor: getTheme().palette.neutralLight,
  });

  const customerColumns: IColumn[] = [
    {
      key: 'option-item',
      name: '#',
      minWidth: 16,
      maxWidth: 204,
      onColumnClick: () => {},
      onRender: (item: any, index?: number) => {
        return (
          <div
            className={`list__item${
              item.id === selectedOptionUnitId ? ' selected' : ''
            }`}
          >
            <div className="list__description">
              <div className="list__description__name">{item.value}</div>
              <div className="list__description__mandatory">
                {item.isMandatory ? 'Allowed' : 'Not allowed'}
              </div>
              <div className="list__description__image">
                {item.imageUrl ? <FontIcon iconName="FileImage" /> : null}
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const getProductStyles: (productId: number) => void = (productId: number) => {
    dispatch(
      assignPendingActions(
        productSettingsActions.apiGetAllOptionGroupsByProductIdList(productId),
        [],
        [],
        (args: any) => {
          dispatch(productSettingsActions.updateOptionGroupList(args));
        },
        (args: any) => {}
      )
    );
  };

  return (
    <div>
      {/* <MarqueeSelection selection={selection}> */}
      <DetailsList
        styles={{
          root: {
            color: 'red',
          },
        }}
        className="options"
        selectionMode={SelectionMode.single}
        columns={customerColumns}
        items={optionUnits}
        isHeaderVisible={false}
        checkboxVisibility={CheckboxVisibility.hidden}
        dragDropEvents={{
          canDrop: (
            dropContext?: IDragDropContext,
            dragContext?: IDragDropContext
          ) => {
            return true;
          },
          canDrag: (item?: any) => {
            return true;
          },
          onDragEnter: (item?: any, event?: DragEvent) => {
            // return string is the css classes that will be added to the entering element.
            return dragEnterClass;
          },
          onDragLeave: (item?: any, event?: DragEvent) => {
            return;
          },
          onDrop: (item?: any, event?: DragEvent) => {
            if (draggedItem) {
              const draggedItems = selection.isIndexSelected(draggedIndex)
                ? (selection.getSelection() as any[])
                : [draggedItem!];

              const insertIndex = optionUnits.indexOf(item);
              const items = optionUnits.filter(
                (itm) => draggedItems.indexOf(itm) === -1
              );

              items.splice(insertIndex, 0, ...draggedItems);

              items.forEach((item: OptionUnit, index: number) => {
                item.orderIndex = index;
              });

              let action = assignPendingActions(
                productSettingsActions.modifyOptionUnitsOrder(
                  new List<OptionUnit>(items)
                    .select<ModifiedOptionUnitOrder>((item: OptionUnit) => {
                      let result = new ModifiedOptionUnitOrder();
                      result.optionUnitId = item.id;
                      result.orderIndex = item.orderIndex;

                      return result;
                    })
                    .toArray()
                ),
                [],
                [],
                (args: any) => {
                  if (targetProduct?.id) getProductStyles(targetProduct.id);
                }
              );
              dispatch(action);
            }
          },
          onDragStart: (
            item?: any,
            itemIndex?: number,
            selectedItems?: any[],
            event?: MouseEvent
          ) => {
            setDraggedItem(item);
            setDraggedIndex(itemIndex!);
          },
          onDragEnd: (item?: any, event?: DragEvent) => {
            setDraggedItem(undefined);
            setDraggedIndex(-1);
          },
        }}
        onRenderRow={(args: any) => {
          return (
            <div
              onClick={(clickArgs: any) => {
                const offsetParent: any =
                  clickArgs?.target?.offsetParent?.className;

                if (!offsetParent.includes(DATA_SELECTION_DISABLED_CLASS)) {
                  dispatch(
                    productSettingsActions.changeTargetOptionunit(args.item)
                  );
                  dispatch(
                    dispatch(
                      productSettingsActions.toggleOptionUnitFormVisibility(
                        true
                      )
                    )
                  );
                }
              }}
            >
              <DetailsRow
                styles={{
                  cell: {
                    padding: 0,
                  },
                }}
                {...args}
              />
            </div>
          );
        }}
      />
      {/* </MarqueeSelection> */}
    </div>
  );
};

export default OptionItemsOrderingList;
