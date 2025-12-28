import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { changeObjectPosition, changeObjectSize } from '../../store/slices/objectsSlice';
import { selectImageObjectById, selectSelectedObjects, isObjectSelected } from '../../store/selectors/presentationSelectors';
import { PREVIEW_SCALE, MIN_DIV_HEIGHT, MIN_DIV_WIDTH, PLAYER_RATIO } from '../../store/data/const_for_presantation';
import { useResize } from '../../hooks/useResize';
import { ResizeHandles } from '../../hooks/ResizeHandle';
import styles from './ImageObject.module.css';

type ImageObjectProps = {
  objectId: string;
  isPreview: boolean;
  isPlayer: boolean;
  isDragging: boolean;
  isSelected: boolean;
  isPrimarySelected: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function ImageObject(props: ImageObjectProps) {
  const object = useAppSelector(selectImageObjectById(props.objectId));
  const selectedObjects = useAppSelector(selectSelectedObjects);
  const isSelected = useAppSelector(state => isObjectSelected(state, props.objectId));
  const dispatch = useAppDispatch();

  let scale = props.isPreview ? PREVIEW_SCALE : 1;
  if (props.isPlayer) {
    scale = PLAYER_RATIO;
  }
  const isInteractive = !(props.isPreview || props.isPlayer);
  
  const hasMultipleSelection = selectedObjects.length > 1;
  const isPartOfMultipleSelection = isSelected && hasMultipleSelection;

  const currentX = object?.x ? object.x * scale : 0;
  const currentY = object?.y ? object.y * scale : 0;

  const resize = useResize({
    width: object?.w ? object.w * scale : 100,
    height: object?.h ? object.h * scale : 100,
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
    props.isDragging ? styles.cursorGrabbing : styles.cursorPointer
  ].join(' ');

  const containerStyle: React.CSSProperties = {
    left: `${object.x * scale}px`,
    top: `${object.y * scale}px`,
    width: `${object.w * scale}px`,
    height: `${object.h * scale}px`,
    position: 'absolute',
    ...props.style 
  };

  return (
    <div 
      className={containerClass} 
      style={containerStyle}
      onMouseDown={props.onMouseDown}
    >
      <img
        src={object.src}
        className={imageClass}
        draggable={false}
        alt=""
      />

      {isSelected && isInteractive && !hasMultipleSelection && (
        <ResizeHandles onMouseDown={resize.onResizeHandleMouseDown} />
      )}
    </div>
  );
}