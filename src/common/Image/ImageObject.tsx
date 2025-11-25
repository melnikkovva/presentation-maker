import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleObjectSelection, clearSelection } from '../../store/slices/selectionSlice';
import { changeObjectPosition, changeObjectSize, changeMultipleObjectsPosition } from '../../store/slices/objectsSlice';
import { selectImageObjectById, selectSelectedObjects, isObjectSelected } from '../../store/selectors/presentationSelectors';
import { PREVIEW_SCALE, MIN_DIV_HEIGHT, MIN_DIV_WIDTH } from '../../store/data/const_for_presantation';
import { useDnd } from '../../hooks/useDragAndDrop';
import { useResize } from '../../hooks/useResize';
import { ResizeHandles } from '../../hooks/ResizeHandle';
import styles from './ImageObject.module.css';

type ImageObjectProps = {
  objectId: string;
  isPreview: boolean;
}

export function ImageObject(props: ImageObjectProps) {
  const object = useAppSelector(selectImageObjectById(props.objectId));
  const selectedObjects = useAppSelector(selectSelectedObjects);
  const isSelected = useAppSelector(state => isObjectSelected(state, props.objectId));
  const dispatch = useAppDispatch();

  const scale = props.isPreview ? PREVIEW_SCALE : 1;
  const isInteractive = !props.isPreview;
  
  const hasMultipleSelection = selectedObjects.length > 1;
  const isPartOfMultipleSelection = isSelected && hasMultipleSelection;

  const currentX = object?.x ? object.x * scale : 0;
  const currentY = object?.y ? object.y * scale : 0;

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
    height: object?.h ? object.h * scale : 100,
    x: drag.left, 
    y: drag.top,
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
        if (newX !== currentX || newY !== currentY) {
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
        if (newX !== currentX || newY !== currentY) {
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
        typeElement: 'image' 
      }));
    } else {
      dispatch(clearSelection());
      if (!isSelected) {
        dispatch(toggleObjectSelection({ 
          slideId: object.slideId, 
          objectId: object.id, 
          typeElement: 'image' 
        }));
      }    
    }
  }

  if (!object) {
    return null;
  }

  const containerClass = [
    styles.container,
    isSelected ? styles.containerSelected : '',
    isPartOfMultipleSelection ? styles.multiSelected : ''
  ].join(' ');

  const imageClass = [
    styles.image,
    drag.isDragging ? styles.cursorGrabbing : styles.cursorPointer
  ].join(' ');

  const containerStyle: React.CSSProperties = {
    left: `${drag.left}px`, 
    top: `${drag.top}px`,
    width: `${object.w * scale}px`,
    height: `${object.h * scale}px`,
    position: 'absolute',
  };

  return (
    <div className={containerClass} style={containerStyle}>
      <img
        src={object.src}
        className={imageClass}
        onClick={handleClick}
        onMouseDown={drag.isDragging ? undefined : drag.onMouseDown}
        draggable={false}
        alt=""
      />

      {isSelected && isInteractive && !hasMultipleSelection && (
        <ResizeHandles onMouseDown={resize.onResizeHandleMouseDown} />
      )}
    </div>
  );
}