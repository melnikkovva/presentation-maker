import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleObjectSelection, clearSelection } from '../../store/slices/selectionSlice';
import { changeObjectPosition, changeObjectSize, changeMultipleObjectsPosition } from '../../store/slices/objectsSlice';
import { selectTextObjectById, selectSelectedObjects, isObjectSelected } from '../../store/selectors/presentationSelectors';
import { DEFAULT_PADDING_TEXT_FIELD, MIN_DIV_HEIGHT, MIN_DIV_WIDTH, PREVIEW_SCALE } from '../../store/data/const_for_presantation';
import { useDnd } from '../../hooks/useDragAndDrop';
import { useResize } from '../../hooks/useResize';
import { ResizeHandles } from '../../hooks/ResizeHandle';
import styles from './TextObject.module.css';

type TextObjectProps = {
  objectId: string;
  isPreview: boolean;
}

export function TextObject(props: TextObjectProps) {
  const object = useAppSelector(selectTextObjectById(props.objectId));
  const selectedObjects = useAppSelector(selectSelectedObjects);
  const isSelected = useAppSelector(state => isObjectSelected(state, props.objectId));
  const dispatch = useAppDispatch();

  const scale = props.isPreview ? PREVIEW_SCALE : 1;
  const isInteractive = !props.isPreview;

  const currentX = object?.x ? object.x * scale : 0;
  const currentY = object?.y ? object.y * scale : 0;

  const hasMultipleSelection = selectedObjects.length > 1;
  const isPartOfMultipleSelection = isSelected && hasMultipleSelection;

  const drag = useDnd({
    startX: currentX,
    startY: currentY,
    onDrag: (newX, newY, deltaX, deltaY) => {
      if (object) {
        const actualX = newX / scale;
        const actualY = newY / scale;

        if (isPartOfMultipleSelection) {
          const deltaXActual = deltaX / scale;
          const deltaYActual = deltaY / scale;

          const objectsToMove = selectedObjects
            .filter(item => item.objectId !== props.objectId)
            .map(item => ({
              objectId: item.objectId,
              deltaX: deltaXActual,
              deltaY: deltaYActual
            }));

          dispatch(changeMultipleObjectsPosition({
            primaryObjectId: props.objectId,
            primaryNewX: actualX,
            primaryNewY: actualY,
            otherObjects: objectsToMove
          }));
        } else {
          dispatch(changeObjectPosition({
            objectId: object.id,
            x: actualX,
            y: actualY
          }));
        }
      }
    },
    onFinish: (newX, newY) => {
      if (object) {
        const actualX = newX / scale;
        const actualY = newY / scale;

        if (isPartOfMultipleSelection) {
          const deltaX = (newX - currentX) / scale;
          const deltaY = (newY - currentY) / scale;

          const objectsToMove = selectedObjects
            .filter(item => item.objectId !== props.objectId)
            .map(item => ({
              objectId: item.objectId,
              deltaX: deltaX,
              deltaY: deltaY
            }));

          dispatch(changeMultipleObjectsPosition({
            primaryObjectId: props.objectId,
            primaryNewX: actualX,
            primaryNewY: actualY,
            otherObjects: objectsToMove
          }));
        } else {
          dispatch(changeObjectPosition({
            objectId: object.id,
            x: actualX,
            y: actualY
          }));
        }
      }
    },
  });

  const resize = useResize({
    width: object?.w ? object.w * scale : 100,
    height: object?.h ? object.h * scale : 50,
    x: object?.x ? object.x * scale : 0,
    y: object?.y ? object.y * scale : 0,
    enabled: isInteractive && isSelected && !hasMultipleSelection,
    onResize: (newWidth, newHeight, newX, newY) => {
      if (object) {
        const actualWidth = newWidth / scale;
        const actualHeight = newHeight / scale;
        const actualX = newX / scale;
        const actualY = newY / scale;
        dispatch(changeObjectSize({
          objectId: object.id,
          width: actualWidth,
          height: actualHeight
        }));
        if (newX !== object.x * scale || newY !== object.y * scale) {
          dispatch(changeObjectPosition({
            objectId: object.id,
            x: actualX,
            y: actualY
          }));
        }
      }
    },
    onResizeEnd: (newWidth, newHeight, newX, newY) => {
      if (object) {
        const actualWidth = newWidth / scale;
        const actualHeight = newHeight / scale;
        const actualX = newX / scale;
        const actualY = newY / scale;
        dispatch(changeObjectSize({
          objectId: object.id,
          width: actualWidth,
          height: actualHeight
        }));
        if (newX !== object.x * scale || newY !== object.y * scale) {
          dispatch(changeObjectPosition({
            objectId: object.id,
            x: actualX,
            y: actualY
          }));
        }
      }
    },
    minWidth: MIN_DIV_WIDTH,
    minHeight: MIN_DIV_HEIGHT
  });

  function handleClick(event: React.MouseEvent): void {
    if (props.isPreview || !object) return;

    if (event.ctrlKey || event.metaKey) {
      dispatch(toggleObjectSelection({
        slideId: object.slideId,
        objectId: object.id,
        typeElement: 'text'
      }));
    } else {
      dispatch(clearSelection());
      if (!isSelected) {
        dispatch(toggleObjectSelection({
          slideId: object.slideId,
          objectId: object.id,
          typeElement: 'text'
        }));
      } 
    }
  }
  

  if (!object) {
    return null;
  }

  const getTextAlignClass = () => {
    switch (object.textAlign) {
      case 'left': return styles.textContentLeft;
      case 'right': return styles.textContentRight;
      case 'justify': return styles.textContentJustify;
      default: return styles.textContentCenter;
    }
  };

  const containerClasses = [
    styles.container,
    isSelected ? styles.containerSelected : '',
    isPartOfMultipleSelection ? styles.multiSelected : ''
  ].join(' ');

  const textClasses = [
    styles.textContent,
    getTextAlignClass(),
    drag.isDragging ? styles.cursorGrabbing : styles.cursorPointer
  ].join(' ');

  const containerStyle: React.CSSProperties = {
    left: `${object.x * scale}px`,
    top: `${object.y * scale}px`,
    width: `${object.w * scale}px`,
    height: `${object.h * scale}px`,
    position: 'absolute',
  };

  const textStyle: React.CSSProperties = {
    fontSize: `${object.fontSize * scale}px`,
    fontFamily: object.fontFamily,
    fontWeight: object.fontWeight,
    textDecoration: object.textDecoration,
    color: object.color,
    padding: `${DEFAULT_PADDING_TEXT_FIELD}px`,
  };

  if (object.shadow) {
    textStyle.textShadow = `${object.shadow.x}px 
                            ${object.shadow.y}px 
                            ${object.shadow.blur}px 
                            ${object.shadow.color}`;
  }

  return (
    <div className={containerClasses} style={containerStyle}>
      <div
        className={textClasses}
        style={textStyle}
        onClick={handleClick}
        onMouseDown={drag.isDragging ? undefined : drag.onMouseDown}
      >
        {object.text}
      </div>

      {isSelected && isInteractive && !hasMultipleSelection && (
        <ResizeHandles onMouseDown={resize.onResizeHandleMouseDown} />
      )}
    </div>
  );
}