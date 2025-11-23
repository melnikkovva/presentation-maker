import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectObject } from '../../store/slices/selectionSlice';
import { changeObjectPosition, changeObjectSize } from '../../store/slices/objectsSlice';
import { selectImageObjectById, selectSelectedObjectId } from '../../store/selectors/presentationSelectors';
import { PREVIEW_SCALE, MIN_DIV_HEIGHT, MIN_DIV_WIDTH } from '../../store/data/const_for_presantation';
import { useDnd } from '../../hooks/useDragAndDrop';
import { useResize } from '../../hooks/useResize';
import { ResizeHandles } from '../../hooks/ResizeHandle';
import styles from './ImageObject.module.css';

type ImageObjectProps = {
  objectId: string;
  isPreview: boolean;
}

export function ImageObject({ objectId, isPreview }: ImageObjectProps) {
  const object = useAppSelector(selectImageObjectById(objectId));
  const selectedObjectId = useAppSelector(selectSelectedObjectId);
  const dispatch = useAppDispatch();

  const scale = isPreview ? PREVIEW_SCALE : 1;
  const isInteractive = !isPreview;
  const isSelected = objectId === selectedObjectId;

  const drag = useDnd({
    startX: object?.x ? object.x * scale : 0,
    startY: object?.y ? object.y * scale : 0,
    onDrag: (newX, newY) => {
      if (object) {
        const actualX = newX / scale;
        const actualY = newY / scale;
        dispatch(changeObjectPosition({ 
          objectId: object.id, 
          x: actualX, 
          y: actualY 
        }));
      }
    },
    onFinish: (newX, newY) => {
      if (object) {
        const actualX = newX / scale;
        const actualY = newY / scale;
        dispatch(changeObjectPosition({ 
          objectId: object.id, 
          x: actualX, 
          y: actualY 
        }));
      }
    }
  });

  const resize = useResize({
    width: object?.w ? object.w * scale : 100,
    height: object?.h ? object.h * scale : 100,
    x: object?.x ? object.x * scale : 0,
    y: object?.y ? object.y * scale : 0,
    enabled: isInteractive && isSelected,
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

  function handleClick(): void {
    if (isPreview || !object) return;

    if (isSelected) {
      dispatch(selectObject(null));
    } else {
      dispatch(selectObject({ 
        slideId: object.slideId, 
        objectId: object.id, 
        typeElement: 'image' 
      }));
    }
  }

  if (!object) {
    return null;
  }

  const containerClass = [
    styles.container,
    isSelected ? styles.containerSelected : ''
  ].join(' ');

  const imageClass = [
    styles.image,
    drag.isDragging ? styles.cursorGrabbing : styles.cursorPointer
  ].join(' ');

  const containerStyle: React.CSSProperties = {
    left: `${object.x * scale}px`,
    top: `${object.y * scale}px`,
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

      {isSelected && isInteractive && (
        <ResizeHandles onMouseDown={resize.onResizeHandleMouseDown} />
      )}
    </div>
  );
}